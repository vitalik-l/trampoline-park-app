import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { observer } from 'mobx-react-lite';
import { useStore } from './StoreProvider';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridSortDirection } from '@mui/x-data-grid';
import { observable, toJS } from 'mobx';
import { db } from '../api/dexie';
import { css } from '@emotion/react';

const dateFormatter = (params: any) =>
  params.value ? new Date(params.value).toLocaleString() : null;

const COLUMNS: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 1 },
  {
    field: 'number',
    headerName: 'Номер',
    flex: 1,
  },
  {
    field: 'name',
    headerName: 'Имя',
    flex: 1,
  },
  {
    field: 'limit',
    headerName: 'Лимит (минут)',
    minWidth: 120,
    flex: 1,
  },
  {
    field: 'createdAt',
    headerName: 'Создан',
    valueFormatter: dateFormatter,
    flex: 1,
  },
  {
    field: 'startedAt',
    headerName: 'Старт',
    valueFormatter: dateFormatter,
    flex: 1,
  },
  {
    field: 'stoppedAt',
    headerName: 'Остановлен',
    valueFormatter: dateFormatter,
    flex: 1,
  },
  {
    field: 'comment',
    headerName: 'Комментарий',
    flex: 1,
  },
];

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useQuery = (queryFn: () => PromiseLike<any>) => {
  const [query] = React.useState(() =>
    observable({
      isLoading: false,
      data: undefined,
      setData(value: any) {
        this.data = value;
      },
      setLoading(value: boolean) {
        this.isLoading = value;
      },
      fetch() {
        this.setLoading(true);
        queryFn().then((res) => {
          this.setData(res);
          this.setLoading(false);
        });
      },
    }),
  );

  return query;
};

export const HistoryDialog = observer((props: React.ComponentProps<typeof Dialog>) => {
  const store = useStore();
  const open = store.isHistoryOpen;
  const query = useQuery(() => db.clients.toArray());

  React.useEffect(() => {
    if (open) {
      query.fetch();
    }
  }, [open, query]);

  const onClose = () => {
    store.setOpenHistory(false);
  };

  return (
    <Dialog fullScreen onClose={onClose} TransitionComponent={Transition} open={open}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            История
          </Typography>
          <Button autoFocus color="inherit" onClick={onClose}>
            Закрыть
          </Button>
        </Toolbar>
      </AppBar>
      <div
        css={css`
          flex: 1;
        `}
      >
        <DataGrid
          rows={toJS(query.data) ?? []}
          columns={COLUMNS}
          pageSize={30}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'id', sort: 'desc' }],
            },
          }}
        />
      </div>
    </Dialog>
  );
});
