import React from 'react';
import { css } from '@emotion/react';
import ButtonBase from '@mui/material/ButtonBase';
import { observer } from 'mobx-react-lite';
import { useStore } from './StoreProvider';
import { computed } from 'mobx';

type Props = {
  number: number;
};

export const Client = observer(({ number }: Props) => {
  const store = useStore();
  const client = computed(() =>
    [...store.clients].find((client) => client.number === number),
  ).get();
  console.log(client?.number);

  return (
    <ButtonBase
      css={css`
        background: azure;
        border: 1px solid gray;
      `}
      onClick={() => {
        if (client) return;
        store.addClient({ number });
      }}
      onDoubleClick={() => {
        if (!client) return;
        store.removeClient(client);
      }}
    >
      {number}
    </ButtonBase>
  );
});
