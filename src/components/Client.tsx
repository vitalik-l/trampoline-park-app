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
import styled from '@emotion/styled';
import { ClientState } from '../store/ClientStore';

type Props = {
  number: number;
};

const COLORS = {
  green: '#18df21',
};

const endAnimation = keyframes`
  from {
    background: white;
  }
  to {
    background: ${red[500]};
  }
`;

const Header = styled.div`
  height: 3.8em;
  display: flex;
  align-items: center;
  padding: 0.2em 0;
  width: 100%;
  justify-content: center;
`;

const ContentBgBase = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ContentBg = styled(ContentBgBase)`
  background: ${COLORS.green};
`;

const ContentBgProgress = styled(ContentBgBase)`
  background: ${red[500]};
  transition: transform 0.5s;
`;

const stateStyles: { [key in ClientState]?: ReturnType<typeof css> } = {
  [ClientState.CREATED]: css`
    background: yellow;
  `,
  [ClientState.PAUSED]: css`
    background: orange;
  `,
  [ClientState.IN_PROGRESS]: css`
    ${Header} {
      background: ${COLORS.green};
    }
  `,
  [ClientState.FINISHED]: css`
    animation: 0.5s ${endAnimation} ease-in-out infinite alternate;

    ${ContentBg}, ${ContentBgProgress} {
      background: none;
    }
  `,
};

const Root = styled(ButtonBase)<{ state?: ClientState }>`
  width: 100%;
  height: 100%;
  flex-direction: column;
  text-shadow: 1px 1px 1px #565656;
  font-size: 1em;
  ${({ state }) => (state !== undefined ? stateStyles[state] : null)}
`;

export const Client = observer(({ number }: Props) => {
  const store = useStore();
  const client = store.clients.get(number);
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!client) return;
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null,
    );
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  return (
    <Paper onContextMenu={handleContextMenu}>
      <Menu
        anchorReference="anchorPosition"
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorPosition={
          contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
        }
      >
        {!client?.isStarted && (
          <MenuItem
            onClick={() => {
              client?.start();
              handleContextMenuClose();
            }}
          >
            Старт
          </MenuItem>
        )}
        {client?.isStarted && (
          <MenuItem
            onClick={() => {
              client?.togglePause();
              handleContextMenuClose();
            }}
          >
            {client?.isPaused ? 'Старт' : 'Пауза'}
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            if (client) {
              store.clients.remove(client);
              handleContextMenuClose();
            }
          }}
        >
          Удалить
        </MenuItem>
      </Menu>
      <Root
        state={client?.state}
        onClick={() => {
          store.openClientDialog(number);
        }}
      >
        <Header
          css={css`
            ${!!client?.name ? 'border-bottom: 1px solid #ffffff94;' : ''}
          `}
        >
          <Typography variant="h6" sx={{ fontSize: '2.2em' }}>
            {client?.name}
          </Typography>
        </Header>
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
                padding-top: 1em;
                padding-right: 0.1em;
                box-sizing: border-box;
              `}
            >
              <div
                css={css`
                  width: 7em;
                `}
              >
                <Typography variant="h4" sx={{ fontSize: '5em' }}>
                  {number}
                </Typography>
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
                    font-size: 2.4em;
                    display: flex;
                    flex-direction: column;
                    grid-gap: 0.1em;
                  `}
                >
                  <div>{client?.timeStart?.toLocaleTimeString()}</div>
                  <div>{client?.timeEnd.toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
            <div
              css={css`
                display: flex;
                align-items: center;
                padding: 1em 0;
                justify-content: center;
              `}
            >
              <Typography variant="h5" style={{ fontSize: '3.8em' }}>
                {client ? formatTime(client?.timeLeft) : ''}
              </Typography>
            </div>
          </div>
          {client?.isStarted && !client?.isPaused && (
            <>
              <ContentBg />
              <ContentBgProgress
                style={
                  !client?.isFinished ? { transform: `translateY(-${100 - client.progress}%)` } : {}
                }
              />
            </>
          )}
        </div>
      </Root>
    </Paper>
  );
});
