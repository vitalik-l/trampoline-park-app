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
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { observable, toJS } from 'mobx';
import { db } from '../api/dexie';
import { css } from '@emotion/react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { Pause } from '../store/ClientStore';
import { withStyles } from '@mui/styles';

const StyledDataGrid = (withStyles as any)({
  root: {
    '& .MuiDataGrid-renderingZone': {
      maxHeight: 'none !important',
    },
    '& .MuiDataGrid-cell': {
      lineHeight: 'unset !important',
      maxHeight: 'none !important',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
    },
    '& .MuiDataGrid-row': {
      maxHeight: 'none !important',
    },
  },
  virtualScrollerContent: {
    height: '100% !important',
    overflow: 'scroll',
  },
})(DataGrid);

interface GridCellExpandProps {
  value: string;
  width: number;
}

function isOverflown(element: Element): boolean {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

const GridCellExpand = React.memo(function GridCellExpand(props: GridCellExpandProps) {
  const { width, value } = props;
  const wrapper = React.useRef<HTMLDivElement | null>(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    console.log('mouse enter');
    const isCurrentlyOverflown = isOverflown(cellValue.current!);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent: KeyboardEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: 1,
        height: 1,
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: 1,
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, zIndex: 99999 }}
        >
          <Paper
            elevation={1}
            style={{
              minHeight: wrapper.current!.offsetHeight - 3,
              maxHeight: '300px',
              overflow: 'auto',
            }}
          >
            <Typography variant="body2" style={{ padding: 8, wordBreak: 'break-word' }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  );
});

function renderCellExpand(params: GridRenderCellParams<string>) {
  return <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />;
}

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
    field: 'pauses',
    headerName: 'Паузы',
    renderCell: ({ value }) => (
      <div style={{ padding: '0.5rem 0' }}>
        {value.map((pause: Pause, index: number) => (
          <div key={index}>
            {!!pause?.dateFrom && `с ${new Date(pause?.dateFrom).toLocaleTimeString()}`}
            {!!pause?.dateTo && ` до ${new Date(pause?.dateTo).toLocaleTimeString()}`}
          </div>
        ))}
      </div>
    ),
    flex: 1,
  },
  {
    field: 'stoppedAt',
    headerName: 'Удалён',
    valueFormatter: dateFormatter,
    flex: 1,
  },
  {
    field: 'comment',
    headerName: 'Комментарий',
    width: 300,
    renderCell: renderCellExpand,
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

export const HistoryDialog = observer(() => {
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
        <StyledDataGrid
          disableVirtualization
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
