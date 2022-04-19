import React from 'react';
import { ClientsGrid } from './ClientsGrid';
import { css } from '@emotion/react';
import { ClientDialog } from './ClientDialog';
import { observer } from 'mobx-react-lite';
import { useStore } from './StoreProvider';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import { AddCircleOutlined, Login, ListAlt } from '@mui/icons-material';

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
          <Typography variant="h4">{store.currentTime.value.toLocaleString()}</Typography>
          <div
            css={css`
              flex: 1;
              display: flex;
              justify-content: flex-end;
            `}
          >
            <IconButton>
              <ListAlt />
            </IconButton>
            <IconButton onClick={() => store.openClientDialog()}>
              <AddCircleOutlined />
            </IconButton>
            <IconButton>
              <Login />
            </IconButton>
          </div>
        </div>
      </div>
      <ClientsGrid
        css={css`
          flex: 1;
          background: #f2f5f8;
        `}
      />
      <ClientDialog />
    </div>
  );
});
