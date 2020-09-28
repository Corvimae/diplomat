import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Tabs, Tab, Button, FormGroup, NumericInput, Classes, ControlGroup, MenuItem } from '@blueprintjs/core';
import { BlockPicker, ColorResult } from 'react-color';
import { remote } from 'electron';
import { useTypedSelector } from '../../store';
import { useDispatch } from 'react-redux';
import { setCellSize, setTrackerBackgroundColor, setCountBackgroundColor, setFontFamily } from '../../stores/settings/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ProfileEditor } from './ProfileEditor';

const CELL_SIZE_HELP_TEXT = 'The width and height, in pixels, of each Pokemon in the tracker. Larger values mean fewer Pokemon can fit in each row.';
const COUNTERS_FONT_FAMILY_HELP_TEXT = 'You may specify more than one font families by separating them with commas.';

const ProfilePanel = () => {
  const profiles = useTypedSelector(state => state.profiles.profiles);

  return (
    <ProfilePanelContainer>
      <Tabs vertical renderActiveTabPanelOnly>
        <Button icon={<FontAwesomeIcon icon={faPlus} />}>New profile</Button>
        
        {profiles.map(profile => (
          <Tab key={profile.name} id={profile.name} title={profile.name}/>
        ))}
      </Tabs>

      <ProfileEditor profile={profiles[0]}/>
    </ProfilePanelContainer>
  )
};

const InterfacePanel = () => {
  const settings = useTypedSelector(state => state.settings);
  const dispatch = useDispatch();

  const handleChangeCellSize = useCallback((value: number) => {
    dispatch(setCellSize(value));
  }, [dispatch]);

  const handleChangeFontFamily = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFontFamily(event.target.value));
  }, [dispatch]);

  const handleChangeTrackerBackgroundColor = useCallback((color: ColorResult) => {
    dispatch(setTrackerBackgroundColor(color.hex));
  }, [dispatch])

  const handleChangeCountBackgroundColor = useCallback((color: ColorResult) => {
    dispatch(setCountBackgroundColor(color.hex));
  }, [dispatch])

  return (
    <div>
      <FormGroup label="Cell Size" labelFor="cell-size-input" helperText={CELL_SIZE_HELP_TEXT}>
        <NumericInput
          id="cell-size-input"
          onValueChange={handleChangeCellSize}
          defaultValue={settings.cellSize}
          fill
        />
      </FormGroup>

      <FormGroup label="Counters Font Family" labelFor="counters-font-family-input" helperText={COUNTERS_FONT_FAMILY_HELP_TEXT}>
        <input
          id="counters-font-family-input"
          type="text"
          className={`${Classes.INPUT} bp3-fill`}
          onChange={handleChangeFontFamily}
          defaultValue={settings.fontFamily}
          dir="auto"
        />
      </FormGroup>

      <ColorPickers>
        <FormGroup label="Tracker Background Color">
          <BlockPicker
            color={settings.backgroundColors.tracker}
            onChange={handleChangeTrackerBackgroundColor}
            triangle="hide"
          />
        </FormGroup>

        <FormGroup label="Counters Background Color">
          <BlockPicker
            color={settings.backgroundColors.count}
            onChange={handleChangeCountBackgroundColor}
            triangle="hide"
          />
        </FormGroup>
      </ColorPickers>
    </div>
  );
};

export const Settings = () => {
  const handleClose = useCallback(() => {
    remote.getCurrentWindow().close();
  }, []);

  return (
    <Container>
      <Tabs id="settingsTabs" large>
        <Tab id="interface" title="Interface" panel={<InterfacePanel />} />
        <Tab id="profile" title="Profiles" panel={<ProfilePanel />} />
        <Tabs.Expander />
        <Button intent="primary" onClick={handleClose}>Close</Button>
      </Tabs>
    </Container>
  );
};

const Container = styled.div`
  padding: 0.5rem;
`;

const ColorPickers = styled.div`
  display: flex;

  & > .bp3-form-group {
    margin-right: 2rem;
  }
`;

const ProfilePanelContainer = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
`;