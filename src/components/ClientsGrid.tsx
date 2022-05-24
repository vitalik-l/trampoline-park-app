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
        grid-template: repeat(5, minmax(16em, 1fr)) / repeat(10, minmax(18em, 1fr));
        grid-gap: 0.3em;
        padding: 0.3em;
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
