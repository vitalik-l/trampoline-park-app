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
  console.log(client?.number);

  return (
    <ButtonBase
      css={css`
        background: azure;
        border: 1px solid gray;
      `}
      onClick={() => {
        if (client) {
          if (client.started) {
            client.stop();
            return;
          }
          client.start();
          return;
        }
        store.addClient({ number, limit: 10 });
      }}
      onDoubleClick={() => {
        if (!client) return;
        store.removeClient(client);
      }}
    >
      <div>
        <div>{number}</div>
        <div>time left: {formatTime(client?.counter)}</div>
        <div>time start: {client?.startedAt?.toLocaleString()}</div>
        <div>time end: {client?.timeEnd.toLocaleString()}</div>
      </div>
    </ButtonBase>
  );
});
