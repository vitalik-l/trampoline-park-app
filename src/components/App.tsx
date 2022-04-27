import React from 'react';
import { ClientsGrid } from './ClientsGrid';
import { css } from '@emotion/react';
import { ClientDialog } from './ClientDialog';
import { observer } from 'mobx-react-lite';
import { useStore } from './StoreProvider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import ListAlt from '@mui/icons-material/ListAlt';
import { HistoryDialog } from './HistoryDialog';

export const App = observer(() => {
  const store = useStore();

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}
    >
      <div
        css={css`
          min-height: 80px;
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          background: white;
          z-index: 3;
          box-shadow: 0 2px 1px -1px rgb(0 0 0 / 0%), 0px 1px 1px 0px rgb(0 0 0 / 0%),
            0px 1px 3px 0px rgb(0 0 0 / 12%);
        `}
      >
        <div
          css={css`
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 1rem;
          `}
        >
          <div
            css={css`
              flex: 1;
            `}
          />
          <Typography sx={{ typography: { sm: 'h4', xs: 'h5' } }}>
            {store.currentTime.value.toLocaleString()}
          </Typography>
          <div
            css={css`
              flex: 1;
              display: flex;
              justify-content: flex-end;
              margin-left: 1rem;
            `}
          >
            <IconButton onClick={() => store.setOpenHistory(true)}>
              <ListAlt />
            </IconButton>
            <IconButton onClick={() => store.openClientDialog()}>
              <AddCircleOutlined />
            </IconButton>
          </div>
        </div>
      </div>
      <ClientsGrid
        css={css`
          flex: 1;
          background: #f2f5f8;
          overflow: auto;
        `}
      />
      <ClientDialog />
      <HistoryDialog />
    </div>
  );
});
