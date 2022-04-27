import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { ClientStore } from '../store';
import { Form } from 'react-final-form';
import { observer } from 'mobx-react-lite';
import { useStore } from './StoreProvider';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import { TextField } from 'mui-rff';
import { css } from '@emotion/react';

export const ClientDialog = observer(({ open }: { client?: ClientStore; open?: boolean }) => {
  const store = useStore();
  const number = store.clientNumberDialog;
  const client = number ? store.clients.get(number) : undefined;

  const onClose = () => store.closeClientDialog();

  const onSubmit = (values: { name: string; number: string; limit: string; comment?: string }) => {
    const params = {
      number: +values.number,
      limit: +values.limit,
      comment: values.comment,
      name: values.name,
    };
    if (!client) {
      if (store.clients.get(params.number)) {
        alert('Номер занят');
        return;
      }
      store.clients.add(params);
    } else {
      client.save(params);
    }
    onClose();
  };

  return (
    <Dialog open={open || number !== null}>
      <DialogTitle>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            width: 600px;
            max-width: 100%;
          `}
        >
          <div>Клиент</div>
          <div
            css={css`
              display: flex;
              grid-gap: 1rem;
            `}
          >
            {!!client && (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    store.clients.remove(client);
                    onClose();
                  }}
                >
                  Удалить
                </Button>
                {!client.isStarted && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      client.start();
                      onClose();
                    }}
                  >
                    Старт
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogTitle>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          number,
          name: client?.name,
          limit: client?.limit ?? 60,
          comment: client?.comment,
        }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <div
                css={css`
                  display: flex;
                  grid-gap: 1.5rem;
                  flex-direction: column;
                `}
              >
                <TextField name="number" label="Номер" required />
                <TextField name="name" label="Имя" required />
                <TextField
                  name="limit"
                  label="Минут"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  type="number"
                />
                <TextField name="comment" label="Комментарий" multiline rows={3} />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Закрыть</Button>
              <Button type="submit" variant="contained" color="primary">
                Сохранить
              </Button>
            </DialogActions>
          </form>
        )}
      />
    </Dialog>
  );
});
