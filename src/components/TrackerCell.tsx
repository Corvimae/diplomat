import React from 'react';
import styled from 'styled-components';
import { TrackerItem } from '../stores/tracker/types';
import { POKEMON_SPRITE_BASE_URL } from '../utils/Dex';
import { useTypedSelector } from '../store';

interface TrackerCellProps {
  item: TrackerItem;
}

export const TrackerCell: React.FC<TrackerCellProps> = ({ item }) => {
  const cellSize = useTypedSelector(state => state.settings.cellSize);
  const spriteSet = useTypedSelector(state => state.settings.activeProfile?.spriteSet.path);

  return (
    <Container
      src={`${POKEMON_SPRITE_BASE_URL}${spriteSet}/${item.definition.sprite || `${item.definition.name.toLowerCase()}.png`}`}
      cellSize={cellSize}
    />
  );
};

const Container = styled.button<{ src: string; cellSize: number }>`
  position: relative;
  width: ${props => props.cellSize}px;
  height: ${props => props.cellSize}px;
  background-color: transparent; /* todo */
  background-image: url(${props => props.src});
  background-size: cover;
  border: none;
`;