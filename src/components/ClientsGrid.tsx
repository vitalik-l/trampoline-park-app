import React from 'react';
import { css } from '@emotion/react';
import { Client } from './Client';

const numbers = Array.from({ length: 50 }, (_, i) => i + 1);

export const ClientsGrid = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      css={css`
        display: grid;
        grid-template: repeat(auto-fill, minmax(176px, 1fr)) / repeat(auto-fill, minmax(160px, 1fr));
        grid-gap: 1rem;
        padding: 1rem;
      `}
      {...props}
    >
      {numbers.map((number) => (
        <Client number={number} key={number} />
      ))}
    </div>
  );
};
