import React from 'react';
import { css } from '@emotion/react';
import { Client } from './Client';

const numbers = Array.from({ length: 50 }, (_, i) => i + 1);

export const ClientsGrid = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      css={css`
        display: grid;
        grid-template: repeat(5, 1fr) / repeat(10, 1fr);
      `}
      {...props}
    >
      {numbers.map((number) => (
        <Client number={number} key={number} />
      ))}
    </div>
  );
};
