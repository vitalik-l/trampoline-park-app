import React from 'react';
import { css } from '@emotion/react';
import logo from '../img/logo.jpg';
import Box from '@mui/material/Box';
import { useStore } from './StoreProvider';
import { observer } from 'mobx-react-lite';

export const Footer = observer(() => {
  const store = useStore();
  return (
    <div
      css={css`
        font-size: min(calc(10 * 1vw * 100 / 1920), calc(10 * 1vh * 100 / 1080));
        height: 12em;
        width: 100%;
        background: white;
        box-shadow: 0 2px 1px -1px rgb(0 0 0 / 0%), 0px 1px 1px 0px rgb(0 0 0 / 0%),
          0px 1px 3px 0px rgb(0 0 0 / 12%);
        box-sizing: border-box;
        padding: 1em;
        display: flex;
        align-items: center;
        font-weight: 800;
        justify-content: center;
      `}
    >
      <Box sx={{ fontSize: '5em' }}>{store.currentTime.value.toLocaleDateString()}</Box>
      <img
        src={logo}
        css={css`
          width: auto;
          height: 100%;
          object-fit: contain;
          margin: 0 3em;
        `}
      />
      <Box sx={{ fontSize: '5em' }}>{store.currentTime.value.toLocaleTimeString()}</Box>
    </div>
  );
});
