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
  const client = number ? store.getClient(number) : undefined;

  const timeLimit = React.useMemo(() => {
    const hours = Math.floor((client?.limit ?? 60) / 60);
    const minutes = (client?.limit ?? 0) % 60;
    return { hours, minutes };
  }, [client]);

  const onClose = () => store.closeClientDialog();

  const onSubmit = (values: {
    name: string;
    number: string;
    hours?: string;
    minutes?: string;
    comment?: string;
  }) => {
    const limit = +(values?.hours ?? 0) * 60 + +(values?.minutes ?? 0);
    const params = {
      number: +values.number,
      limit,
      comment: values.comment,
      name: values.name,
    };
    if (!client) {
      store.addClient(params);
    } else {
      client.save(params);
    }
    onClose();
  };

  return (
    <Dialog open={open || number !== null} onClose={onClose}>
      <DialogTitle>Клиент</DialogTitle>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          number,
          name: client?.name,
          hours: timeLimit.hours,
          minutes: timeLimit.minutes,
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
                <div
                  css={css`
                    display: flex;
                    grid-gap: 1rem;
                  `}
                >
                  <TextField
                    name="hours"
                    label="Часов"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    type="number"
                  />
                  <TextField
                    name="minutes"
                    label="Минут"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    type="number"
                  />
                </div>
                <TextField name="comment" label="Комментарий" multiline rows={3} />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Закрыть</Button>
              {!!client && (
                <Button variant="contained" color="error">
                  Удалить
                </Button>
              )}
              {!!client && (
                <Button variant="contained" color="success">
                  Старт
                </Button>
              )}
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
