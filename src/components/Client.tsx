import React from 'react';
import { css } from '@emotion/react';
import ButtonBase from '@mui/material/ButtonBase';
import { observer } from 'mobx-react-lite';
import { useStore } from './StoreProvider';
import { formatTime } from '../utils/formatTime';

type Props = {
  number: number;
};

export const Client = observer(({ number }: Props) => {
  const store = useStore();
  const client = store.getClient(number);

  return (
    <ButtonBase
      css={css`
        background: azure;
        border: 1px solid gray;
      `}
      onClick={() => {
        store.openClientDialog(number);
      }}
    >
      <div>
        <div>{number}</div>
        <div>time start: {client?.timeStart?.toLocaleString()}</div>
        <div>time end: {client?.timeEnd.toLocaleString()}</div>
        <div>
          time left: {formatTime(client?.timeLeft)} {client?.percentSpent}%
        </div>
      </div>
    </ButtonBase>
  );
});
