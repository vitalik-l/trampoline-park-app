import React from 'react';
import Button from '@mui/material/Button';
import { ClientsGrid } from './ClientsGrid';
import { css } from '@emotion/react';

export const App = () => {
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
        <Button variant="contained">Button</Button>
      </div>
      <ClientsGrid
        css={css`
          flex: 1;
        `}
      />
    </div>
  );
};
