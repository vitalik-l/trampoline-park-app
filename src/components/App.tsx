import React from 'react';
import { ClientsGrid } from './ClientsGrid';
import { css } from '@emotion/react';
import { ClientDialog } from './ClientDialog';
import { observer } from 'mobx-react-lite';
import { useStore } from './StoreProvider';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import ListAlt from '@mui/icons-material/ListAlt';
import { HistoryDialog } from './HistoryDialog';
import Box from '@mui/material/Box';
import { Footer } from './Footer';

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
          font-size: min(calc(10 * 1vw * 100 / 1920), calc(10 * 1vh * 100 / 1080));
          min-height: 9em;
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
          <Box sx={{ fontSize: '4em', fontWeight: 800 }}>
            {store.currentTime.value.toLocaleString()}
          </Box>
          <div
            css={css`
              flex: 1;
              display: flex;
              justify-content: flex-end;
              margin-left: 1rem;
            `}
          >
            <IconButton onClick={() => store.historyDialog.toggle(true)}>
              <ListAlt />
            </IconButton>
            <IconButton onClick={() => store.clientDialog.open()}>
              <AddCircleOutlined />
            </IconButton>
          </div>
        </div>
      </div>
      <ClientsGrid
        css={css`
          flex: 1;
          background: #292826;
          overflow: auto;
        `}
      />
      <Footer />
      <ClientDialog />
      <HistoryDialog />
    </div>
  );
});
