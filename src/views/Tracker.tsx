import React, { useCallback } from 'react';
import styled from 'styled-components';
import { remote } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { useTypedSelector } from '../store';
import { TrackerCell } from '../components/TrackerCell';
import { FullColorBackground } from '../utils/Layout';

declare var SETTINGS_WINDOW_WEBPACK_ENTRY: any;

export const Tracker = () => {
  const pokemon = useTypedSelector(state => state.tracker.pokemon);
  const backgroundColor = useTypedSelector(state => state.settings.backgroundColors.tracker);
  
  const handleShowSettings = useCallback(() => {
    let win = new remote.BrowserWindow({
      parent: remote.getCurrentWindow(),
      width: 1080,
      modal: true,
      webPreferences: {
        enableRemoteModule: true,
        nodeIntegration: true,
      },
    })
    
    win.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);
  }, []);

  return (
    <FullColorBackground backgroundColor={backgroundColor}>
      <Container>
        {pokemon.map(item => <TrackerCell key={item.definition.id} item={item} />)}
        <ActionsContainer>
          <ActionButton onClick={handleShowSettings}>
            <ActionIcon icon={faCog} />
          </ActionButton>
        
        </ActionsContainer>
      </Container>
    </FullColorBackground>
  );
};

const ActionsContainer = styled.div`
  position: absolute;
  display: none;
  bottom: 0;
  right: 0;
  flex-direction: row;
`;

const ActionIcon = styled(FontAwesomeIcon)`
  color: rgba(0, 0, 0, 0.25);
  transition: color 100ms ease-in;
`;

const ActionButton = styled.button`
  display: flex;
  background-color: transparent;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;

  &:hover ${ActionIcon} {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  &:hover ${ActionsContainer} {
    display: flex;
  }
`;
