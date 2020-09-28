import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { SpriteSet, SPRITE_SETS, filterSpriteSet, renderSpriteSet } from './SpriteSets';
import { Select } from '@blueprintjs/select';
import { FormGroup, Classes, MenuItem, Button, ControlGroup, Popover, Switch } from '@blueprintjs/core';
import { Table, Column, EditableCell, Cell } from '@blueprintjs/table';
import { Profile, TrackerStateDefinition } from '../../stores/profiles/types';
import { POKEMON_SPRITE_BASE_URL } from '../../utils/Dex';
import { BlockPicker, ColorResult } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const PROFILE_NAME_HELP_TEXT = 'The name of the profile. The profile name must be unique from the rest of your profiles.';
const SPRITE_SET_HELP_TEXT = <>
  Sprite sets are fetched from Pokemon Showdown. See <a href="https:/play.pokemonshowdown.com/sprites">play.pokemonshowdown.com/sprites</a> for the full collection.
</>;
const PROFILE_STATES_HELP_TEXT = 'Left-clicking a Pokemon will set it to the primary state. Right-clicking will cycle through the other states. If "Show count?" is checked, the total number of Pokemon with the status will be shown in the counts window.';
const POKEMON_TABLE_HELP_TEXT_1 = 'By default, a Pokemon\'s name will be fetched automatically from the sprite set, so a Sprite URL does not need to be specified. If the Pokemon has a complex name, like Farfetch\'d or Mr. Mime, you may need to specify the sprite URL manually.';
const POKEMON_TABLE_HELP_TEXT_2 = 'Pokemon are displayed in the order they are listed in this table, not by their Dex number. You can reorder them by selecting one or more rows, and dragging them to the desired position.';
const POKEMON_TABLE_HELP_TEXT_3 = 'If more than one Pokemon variant use the same Dex number, such as Oricorio, then you can either give the other variants an unused Dex number or lay down and cry.';

const SpriteSetSelector = Select.ofType<SpriteSet>();

interface ProfileEditorProps {
  profile: Profile;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile }) => {
  const [editedProfile, setEditedProfile] = useState<Profile>(profile);
  const [stateCellErrors, setStateCellErrors] = useState<Record<string, string | null>>({});

  const handleChangeProfileName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProfile({
      ...editedProfile,
      name: event.target.value
    });
  }, []);

  const handleSelectSpriteSet = useCallback((spriteSet: SpriteSet) => {
    setEditedProfile({
      ...editedProfile,
      spriteSet,
    });
  }, []);

  const handleAddState = useCallback(() => {
    setEditedProfile({
      ...editedProfile,
      states: [
        ...editedProfile.states,
        {
          name: 'New State',
          color: '#ffffff',
          isPrimary: false,
          showCount: true,
        },
      ],
    });
  }, [editedProfile]);

  const handleDeleteState = useCallback((rowIndex: number) => {
    setEditedProfile({
      ...editedProfile,
      states: editedProfile.states.reduce<TrackerStateDefinition[]>((acc, state, index) => (
        index === rowIndex ? acc : [...acc, state]
      ), []),
    });
  }, [editedProfile]);

  const handleSetTrackerStateColor = useCallback((rowIndex: number, color: ColorResult) => {
    setEditedProfile({
      ...editedProfile,
      states: editedProfile.states.reduce<TrackerStateDefinition[]>((acc, state, index) => [
        ...acc,
        {
          ...state,
          color: index === rowIndex ? color.hex : state.color,
        },
      ], []),
    });
  }, [editedProfile]);

  const handleSetShowCount = useCallback((rowIndex: number, value: boolean) => {
    setEditedProfile({
      ...editedProfile,
      states: editedProfile.states.reduce<TrackerStateDefinition[]>((acc, state, index) => [
        ...acc,
        {
          ...state,
          showCount: index === rowIndex ? value : state.showCount,
        },
      ], []),
    });
  }, [editedProfile]);
  
  const handleSetIsPrimary = useCallback((rowIndex: number, value: boolean) => {
    setEditedProfile({
      ...editedProfile,
      states: editedProfile.states.reduce<TrackerStateDefinition[]>((acc, state, index) => [
        ...acc,
        {
          ...state,
          isPrimary: value ? index === rowIndex : false,
        },
      ], []),
    });
  }, [editedProfile]);

  const handleStateRowsReordered = useCallback((oldIndex: number, newIndex: number) => {
    const stateList = [...editedProfile.states];
    
    stateList.splice(newIndex, 0, stateList.splice(oldIndex, 1)[0]);

    setEditedProfile({
      ...editedProfile,
      states: stateList,
    });
  }, [editedProfile]);

  const validateStateName = useCallback((rowIndex: number, colIndex: number) => {
    return (newValue: string) => {
      setStateCellErrors({
        ...stateCellErrors,
        [`${rowIndex}-${colIndex}`]: editedProfile.states.some((state, index) => state.name === newValue && index !== rowIndex) ? 'Each state must have a unique name.' : null,          
      });

      setEditedProfile({
        ...editedProfile,
        states: editedProfile.states.reduce<TrackerStateDefinition[]>((acc, state, index) => [
          ...acc,
          {
            ...state,
            name: index === rowIndex ? newValue : state.name,
          },
        ], []),
      });
    }
  }, [stateCellErrors, editedProfile]);

  console.log(editedProfile);

  const renderStateNameCell = useCallback((rowIndex: number, colIndex: number) => {
    const cellKey = `${rowIndex}-${colIndex}`;
    const validator = validateStateName(rowIndex, colIndex);

    return (
      <EditableCell
        value={editedProfile.states[rowIndex].name}
        intent={stateCellErrors[cellKey] ? 'danger' : undefined}
        onChange={validator}
        onCancel={validator}
        onConfirm={validator}
      />
    );
  }, [editedProfile, stateCellErrors, validateStateName]);

  const renderColorPickerCell = useCallback((rowIndex: number) => {
    const cellColor = editedProfile.states[rowIndex].color || '#ffffff';
    const colorPicker = (
      <BlockPicker
        color={cellColor}
        onChange={color => handleSetTrackerStateColor(rowIndex, color)}
        triangle="hide"
      />
    );
      
    return (
      <Cell>
        <Popover content={colorPicker} position="auto-end">
          <ColorCell color={cellColor} />
        </Popover>
      </Cell>
    );
  }, [editedProfile.states, handleSetTrackerStateColor]);

  const renderTogglesCell = useCallback((rowIndex: number) => (
    <Cell>
      <Switch
        checked={editedProfile.states[rowIndex].isPrimary ?? false}
        label="Primary"
        onChange={event => handleSetIsPrimary(rowIndex, (event.target as HTMLInputElement).checked)}
        style={{ margin: '0 0.25rem' }}
        inline
      />

      <Switch
        checked={editedProfile.states[rowIndex].showCount ?? false}
        label="Show count?"
        onChange={event => handleSetShowCount(rowIndex, (event.target as HTMLInputElement).checked)}
        style={{ margin: '0 0.25rem' }}
        inline
      />

      <Button intent="danger" small onClick={() => handleDeleteState(rowIndex)}>Delete</Button>
    </Cell>
  ), [editedProfile.states]);

  return (
    <div>
      <FormGroup label="Profile Name" labelFor="profile-name" helperText={PROFILE_NAME_HELP_TEXT}>
        <input
          id="profile-name"
          type="text"
          className={`${Classes.INPUT} bp3-fill`}
          value={editedProfile.name}
          onChange={handleChangeProfileName}
          dir="auto"
        />
      </FormGroup>

      <FormGroup label="Sprite Set" labelFor="sprite-set" helperText={SPRITE_SET_HELP_TEXT}>
        <SpriteSetContainer>
          <SpriteSetSelector
            items={SPRITE_SETS}
            itemPredicate={filterSpriteSet}
            itemRenderer={renderSpriteSet}
            noResults={<MenuItem disabled={true} text="No results." />}
            onItemSelect={handleSelectSpriteSet}
            popoverProps={{ minimal: true }}
          >
            <Button
              rightIcon="caret-down"
              text={editedProfile.spriteSet?.name ?? "(No selection)"}
              fill
            />
          </SpriteSetSelector>
          {editedProfile.spriteSet && (
            <SpriteSetExample url={`${POKEMON_SPRITE_BASE_URL}/${editedProfile.spriteSet.path}/abra`} />
          )}
        </SpriteSetContainer>
      </FormGroup>

      <FormGroup label="States" helperText={PROFILE_STATES_HELP_TEXT}>
        <Table
          numRows={editedProfile.states.length}
          columnWidths={[,,300]}
          onRowsReordered={handleStateRowsReordered}
          enableRowReordering
        >
          <Column name="Name" cellRenderer={renderStateNameCell}/>
          <Column name="Color" cellRenderer={renderColorPickerCell} />
          <Column name="" cellRenderer={renderTogglesCell} />
        </Table>

        <Button icon={<FontAwesomeIcon icon={faPlus}/>} onClick={handleAddState}>Add state</Button>
      </FormGroup>

      <FormGroup label="Pokemon">
        <Table numRows={2} enableRowReordering>
          <Column name="Dex No." />
          <Column name="Name" />
          <Column name="Sprite URL (optional)" />
          <Column name="Default state" />
        </Table>
        
        <div className={Classes.FORM_HELPER_TEXT}>{POKEMON_TABLE_HELP_TEXT_1}</div>
        <div className={Classes.FORM_HELPER_TEXT}>{POKEMON_TABLE_HELP_TEXT_2}</div>
        <div className={Classes.FORM_HELPER_TEXT}>{POKEMON_TABLE_HELP_TEXT_3}</div>
      </FormGroup>

      <ControlGroup>
        <Button intent="danger">Delete profile</Button>
        <Button intent="primary">Save profile</Button>
      </ControlGroup>
    </div>
  )
};

const SpriteSetContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SpriteSetExample = styled.div<{ url: string }>`
  width: 2rem;
  height: 2rem;
  margin-left: 1rem;
  background-image: url(${props => props.url}.png), url(${props => props.url}.gif);
  background-size: 200% 200%;
  background-position: center center;
`;

const ColorCell = styled.div<{ color: string }>`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.color};
`;
