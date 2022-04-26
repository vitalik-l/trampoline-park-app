import React from 'react';
import { css, keyframes } from '@emotion/react';
import ButtonBase from '@mui/material/ButtonBase';
import { observer } from 'mobx-react-lite';
import { useStore } from './StoreProvider';
import { formatTime } from '../utils/formatTime';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { green, red } from '@mui/material/colors';

type Props = {
  number: number;
};

const endAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ContextMenu = (props: React.ComponentProps<typeof Menu>) => {
  return (
    <Menu anchorReference="anchorPosition" {...props}>
      <MenuItem>Старт</MenuItem>
      <MenuItem>Удалить</MenuItem>
    </Menu>
  );
};

export const Client = observer(({ number }: Props) => {
  const store = useStore();
  const client = store.clients.get(number);

  return (
    <Paper>
      <ButtonBase
        css={css`
          width: 100%;
          height: 100%;
          flex-direction: column;
          ${client?.isStarted ? 'color: white;' : ''}
        `}
        onClick={() => {
          store.openClientDialog(number);
        }}
      >
        <div
          css={css`
            height: 35px;
            display: flex;
            align-items: center;
            padding: 5px 0;
            width: 100%;
            justify-content: center;
            ${client?.isStarted ? `background: ${green[500]};` : ''}
            ${client?.name ? 'border-bottom: 1px solid #ffffff94;' : ''}
          `}
        >
          <Typography variant="h6">{client?.name}</Typography>
        </div>
        <div
          css={css`
            flex: 1;
            display: flex;
            flex-direction: column;
            width: 100%;
            position: relative;
            overflow: hidden;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              width: 100%;
              z-index: 1;
            `}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
                flex: 1;
                width: 100%;
                padding: 10px 0;
              `}
            >
              <div
                css={css`
                  width: 50px;
                `}
              >
                <Typography variant="h4">{number}</Typography>
              </div>
              <div
                css={css`
                  flex: 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                `}
              >
                <div
                  css={css`
                    font-weight: 400;
                    font-size: 1.2rem;
                  `}
                >
                  <div>{client?.timeStart?.toLocaleTimeString()}</div>
                  <div>{client?.timeEnd.toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
            <div
              css={css`
                height: 50px;
                display: flex;
                align-items: center;
                padding: 5px 0;
                justify-content: center;
              `}
            >
              <Typography variant="h5">{client ? formatTime(client?.timeLeft) : ''}</Typography>
            </div>
          </div>
          {client?.isStarted && (
            <>
              <div
                css={css`
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background: ${green[500]};
                `}
              />
              <div
                css={css`
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background: ${red[500]};
                  transition: transform 0.5s;
                  animation: 0.5s ${client?.isFinished ? endAnimation : ''} 1s ease-in-out infinite
                    alternate;
                `}
                style={
                  !client?.isFinished ? { transform: `translateY(-${100 - client.progress}%)` } : {}
                }
              />
            </>
          )}
        </div>
      </ButtonBase>
    </Paper>
  );
});
