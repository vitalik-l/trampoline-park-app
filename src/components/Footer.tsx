import React from 'react';
import { css } from '@emotion/react';
import logo from '../img/logo.jpg';

export const Footer = () => {
  return (
    <div
      css={css`
        font-size: min(calc(10 * 1vw * 100 / 1920), calc(10 * 1vh * 100 / 1080));
        height: 16em;
        width: 100%;
        background: white;
        box-shadow: 0 2px 1px -1px rgb(0 0 0 / 0%), 0px 1px 1px 0px rgb(0 0 0 / 0%),
          0px 1px 3px 0px rgb(0 0 0 / 12%);
        box-sizing: border-box;
        padding: 1em;
      `}
    >
      <img
        src={logo}
        css={css`
          width: 100%;
          height: 100%;
          object-fit: contain;
        `}
      />
    </div>
  );
};
