import React from 'react';
import { ClientsGrid } from './ClientsGrid';
import { css } from '@emotion/react';
import { ClientDialog } from './ClientDialog';
import { observer } from 'mobx-react-lite';
import { useStore } from './StoreProvider';
import Typography from '@mui/material/Typography';

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
          `}
        >
          <Typography variant="h4">{store.currentTime.value.toLocaleString()}</Typography>
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
