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
import styled from '@emotion/styled';
import { ClientState } from '../store/ClientStore';

type Props = {
  number: number;
};

const COLORS = {
  green: '#18df21',
  red: '#ff4949',
};

const endAnimation = keyframes`
  from {
    background: white;
  }
  to {
    background: ${COLORS.red};
  }
`;

const Header = styled.div`
  height: 5em;
  display: flex;
  align-items: center;
  padding: 0.2em 0;
  width: 100%;
  justify-content: center;
  overflow: hidden;
  word-break: break-all;
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
  background: ${COLORS.red};
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
  text-shadow: 0.1em 0.1em 0.1em #565656;
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
    <Paper onContextMenu={handleContextMenu} sx={{ borderRadius: 0 }}>
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
            ??????????
          </MenuItem>
        )}
        {client?.isStarted && !client?.isFinished && (
          <MenuItem
            onClick={() => {
              client?.togglePause();
              handleContextMenuClose();
            }}
          >
            {client?.isPaused ? '??????????' : '??????????'}
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
          ??????????????
        </MenuItem>
      </Menu>
      <Root
        state={client?.state}
        onClick={() => {
          store.clientDialog.open(number);
        }}
      >
        <Header
          css={css`
            ${!!client?.name ? 'border-bottom: 1px solid #ffffff94;' : ''}
          `}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: '2.6em',
              margin: 'auto',
              overflow: 'hidden',
              lineHeight: '110%',
              textShadow: 'none',
              fontWeight: 700,
              p: '0 0.5em',
              textTransform: 'uppercase',
            }}
          >
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
              flex: 1;
            `}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
                flex: 1;
                width: 100%;
                //padding-top: 1em;
                padding-right: 0.5em;
                box-sizing: border-box;
              `}
            >
              <div
                css={css`
                  width: 7em;
                  color: blue;
                `}
              >
                <Typography variant="h4" sx={{ fontSize: '4.5em', fontWeight: 800 }}>
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
                    font-weight: 800;
                    font-size: 3em;
                    display: flex;
                    flex-direction: column;
                    grid-gap: 0.2em;
                    text-shadow: none;
                    line-height: 1;
                  `}
                >
                  <div>
                    {client?.timeStart?.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div>
                    {client?.timeEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1;
            `}
          >
            <Typography variant="h5" style={{ fontSize: '3.8em', lineHeight: 1, fontWeight: 800 }}>
              {client ? formatTime(client?.timeLeft) : <>&nbsp;</>}
            </Typography>
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
