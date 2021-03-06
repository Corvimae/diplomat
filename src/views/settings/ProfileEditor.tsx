import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import fs from 'fs';
import path from 'path';
import { remote } from 'electron';
import { BlockPicker, ColorResult } from 'react-color';
import { Select } from '@blueprintjs/select';
import { Table, Column, EditableCell, Cell } from '@blueprintjs/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Profile, TrackerStateDefinition } from '../../stores/profiles/types';
import { SpriteSet, SPRITE_SETS, filterSpriteSet, renderSpriteSet } from './SpriteSets';
import { filterPokemonOption, renderPokemonOption } from './PokemonSelector';
import { FormGroup, Classes, MenuItem, Button, ControlGroup, Popover, Switch } from '@blueprintjs/core';
import { Pokemon, POKEMON_SPRITE_BASE_URL } from '../../utils/Dex';
import TEMP_DATA_SET from '../../../assets/datasets/gen-1.json';
import { filterStateOption, renderStateOption } from './StateOptionSelector';
import { useDispatch } from 'react-redux';
import { deleteProfile, saveProfile } from '../../stores/profiles/actions';

const PROFILE_NAME_HELP_TEXT = 'The name of the profile. The profile name must be unique from the rest of your profiles.';
const SPRITE_SET_HELP_TEXT = <>
  Sprite sets are fetched from Pokemon Showdown. See <a href="https:/play.pokemonshowdown.com/sprites">play.pokemonshowdown.com/sprites</a> for the full collection.
</>;
const PROFILE_STATES_HELP_TEXT = 'Left-clicking a Pokemon will set it to the primary state. Right-clicking will cycle through the other states. If "Show count?" is checked, the total number of Pokemon with the status will be shown in the counts window.';
const POKEMON_TABLE_HELP_TEXT_1 = 'By default, a Pokemon\'s name will be fetched automatically from the sprite set, so a Sprite URL does not need to be specified. If the Pokemon has a complex name, like Farfetch\'d or Mr. Mime, you may need to specify the sprite URL manually.';
const POKEMON_TABLE_HELP_TEXT_2 = 'Pokemon are displayed in the order they are listed in this table, not by their Dex number. You can reorder them by selecting one or more rows, and dragging them to the desired position.';
const POKEMON_TABLE_HELP_TEXT_3 = 'If more than one Pokemon variant use the same Dex number, such as Oricorio, then you can either give the other variants an unused Dex number or lay down and cry.';

const SpriteSetSelector = Select.ofType<SpriteSet>();
const PokemonSelector = Select.ofType<Pokemon>();
const DefaultStateSelector = Select.ofType<TrackerStateDefinition>();

interface ProfileEditorProps {
  profile: Profile;
  setSelectedProfileName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

function normalizeFilename(profileName: string) {
  return `${profileName.toLowerCase().replace(/ \./g, '-')}.json`;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, setSelectedProfileName }) => {
  const [editedProfile, setEditedProfile] = useState<Profile>(profile);
  const [stateCellErrors, setStateCellErrors] = useState<Record<string, string | null>>({});
  const dispatch = useDispatch();

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

  const handleSelectPokemonOption = useCallback((rowIndex: number, pokemon: Pokemon) => {
    setEditedProfile({
      ...editedProfile,
      pokemon: editedProfile.pokemon.reduce<Pokemon[]>((acc, item, index) => [
        ...acc,
        index === rowIndex ? { ...item, ...pokemon } : item,
      ], []),
    });
  }, [editedProfile]);

  const handleSetPokemonSprite = useCallback((rowIndex: number, value: string) => {
    setEditedProfile({
      ...editedProfile,
      pokemon: editedProfile.pokemon.reduce<Pokemon[]>((acc, item, index) => [
        ...acc,
        index === rowIndex ? { ...item, sprite: value } : item,
      ], []),
    });
  }, [editedProfile]);

  const handleSelectStateOption = useCallback((rowIndex: number, state: TrackerStateDefinition) => {
    setEditedProfile({
      ...editedProfile,
      pokemon: editedProfile.pokemon.reduce<Pokemon[]>((acc, item, index) => [
        ...acc,
        index === rowIndex ? { ...item, defaultState: state.name } : item,
      ], []),
    });
  }, [editedProfile]);

  const handleSaveProfile = useCallback(() => {
    const normalizedFilename = editedProfile.fileName ?? normalizeFilename(editedProfile.name);

    fs.writeFileSync(
      path.join(remote.app.getPath('userData'), 'profiles', normalizedFilename), 
      JSON.stringify({
        ...editedProfile,
        fileName: normalizedFilename,
      }, null, 2),
    ); 
    dispatch(saveProfile(editedProfile));
  }, [profile, editedProfile, dispatch]);

  const handleDeleteProfile = useCallback(async () => {
    const normalizedFilename = editedProfile.fileName ?? normalizeFilename(editedProfile.name);

    const { response } = await remote.dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'warning',
      message: `Are you sure you wish to delete the profile ${editedProfile.name}? This can't be undone!`,
      buttons: ['Delete', 'Cancel'],
      defaultId: 1,
    });

    if (response === 0) {
      try {
        fs.unlinkSync(path.join(remote.app.getPath('userData'), 'profiles', normalizedFilename));
      } catch (e) {
        console.log(`Could not delete profile: ${e}`);
      }

      dispatch(deleteProfile(profile.id));
      setSelectedProfileName(undefined);
    }

  }, [profile.id, editedProfile, dispatch]);

  
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

  const renderPokemonOptionCell = useCallback((rowIndex: number) => (
    <SelectorCell>
      <PokemonSelector
        items={TEMP_DATA_SET}
        itemPredicate={filterPokemonOption}
        itemRenderer={renderPokemonOption}
        noResults={<MenuItem disabled={true} text="No results." />}
        onItemSelect={option => handleSelectPokemonOption(rowIndex, option)}
        popoverProps={{ minimal: true }}
      >
        <Button
          rightIcon="caret-down"
          text={(
            <>
              {editedProfile.pokemon[rowIndex].id && (
                <PokemonNumber>#{editedProfile.pokemon[rowIndex].id}&nbsp;</PokemonNumber>
              )}
              {editedProfile.pokemon[rowIndex].name ?? "(No selection)"}
            </>
          )}
          fill
        />
      </PokemonSelector>
    </SelectorCell>
  ), [editedProfile.pokemon]);

  const renderPokemonSpriteCell = useCallback((rowIndex: number, colIndex: number) => (
    <EditableCell
      value={editedProfile.pokemon[rowIndex].sprite}
      onConfirm={newValue => handleSetPokemonSprite(rowIndex, newValue)}
    />
  ), [editedProfile.pokemon, handleSetPokemonSprite]);

  const renderDefaultStateCell = useCallback((rowIndex: number) => (
    <SelectorCell>
      <DefaultStateSelector
        items={editedProfile.states}
        itemPredicate={filterStateOption}
        itemRenderer={renderStateOption}
        noResults={<MenuItem disabled={true} text="No results." />}
        onItemSelect={option => handleSelectStateOption(rowIndex, option)}
        popoverProps={{ minimal: true }}
      >
        <Button
          rightIcon="caret-down"
          text={editedProfile.pokemon[rowIndex].defaultState ?? editedProfile.states.find(state => state.isPrimary)?.name}
          fill
        />
      </DefaultStateSelector>
    </SelectorCell>
  ), [editedProfile]);

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
        <Table numRows={editedProfile.pokemon.length} enableRowReordering>
          <Column name="Name" cellRenderer={renderPokemonOptionCell} />
          <Column name="Sprite URL (optional)" cellRenderer={renderPokemonSpriteCell} />
          <Column name="Default state" cellRenderer={renderDefaultStateCell} />
        </Table>
        
        <div className={Classes.FORM_HELPER_TEXT}>{POKEMON_TABLE_HELP_TEXT_1}</div>
        <div className={Classes.FORM_HELPER_TEXT}>{POKEMON_TABLE_HELP_TEXT_2}</div>
        <div className={Classes.FORM_HELPER_TEXT}>{POKEMON_TABLE_HELP_TEXT_3}</div>
      </FormGroup>

      <ControlGroup>
        <Button intent="danger" onClick={handleDeleteProfile}>Delete profile</Button>
        <Button intent="primary" onClick={handleSaveProfile}>Save profile</Button>
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

const SelectorCell = styled(Cell)`
  display: relative;
  padding: 0;

  & .bp3-popover-target {
    width: 100%;
    height: 100%;
  }
  
  & .bp3-button {
    height: 100%;
    min-height: 0;
    border: none;
    background-image: none;
    box-shadow: none;
    background-color: transparent;
    padding: 0 0.25rem;
    justify-content: space-between;
    font-size: 0.75rem;
    border-radius: 0;

    &:not([class*="bp3-intent-"]):hover {
      box-shadow: none;
    }
  }
`;

const PokemonNumber = styled.span`
  color: #666;
`;