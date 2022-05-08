import React from 'react';
import { css } from '@emotion/react';
import { Client } from './Client';

const numbers = Array.from({ length: 50 }, (_, i) => i + 1);

export const ClientsGrid = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      css={css`
        display: grid;
        justify-content: center;
        //grid-template: repeat(auto-fill, minmax(176px, 1fr)) / repeat(auto-fill, minmax(160px, 1fr));
        grid-template: repeat(5, 18.8em) / repeat(10, 18em);
        grid-gap: 1em;
        padding: 1em;
        font-size: min(calc(10 * 1vw * 100 / 1920), calc(10 * 1vh * 100 / 1080));
      `}
      {...props}
    >
      {numbers.map((number) => (
        <Client number={number} key={number} />
      ))}
    </div>
  );
};
