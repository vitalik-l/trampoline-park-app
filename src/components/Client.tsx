import React from 'react';
import { css } from '@emotion/react';
import ButtonBase from '@mui/material/ButtonBase';
import { observer } from 'mobx-react-lite';
import { useStore } from './StoreProvider';
import { formatTime } from '../utils/formatTime';
import Paper from '@mui/material/Paper';

type Props = {
  number: number;
};

export const Client = observer(({ number }: Props) => {
  const store = useStore();
  const client = store.getClient(number);

  return (
    <Paper>
      <ButtonBase
        css={css`
          width: 100%;
          height: 100%;
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
    </Paper>
  );
});
