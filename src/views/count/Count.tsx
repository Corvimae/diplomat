import React from 'react';
import styled from 'styled-components';
import { useTypedSelector } from '../../store';
import { FullColorBackground } from '../../utils/Layout';

export const Count = () => {
  const pokemon = useTypedSelector(state => state.tracker.pokemon);
  const fontFamily = useTypedSelector(state => state.settings.fontFamily);
  const backgroundColor = useTypedSelector(state => state.settings.backgroundColors.count);

  return (
    <Container backgroundColor={backgroundColor} fontFamily={fontFamily}>
      <CaughtCount>
        <label>Caught</label>
        {pokemon.filter(item => item.state === 'blank').length}
      </CaughtCount>
    </Container>
  );
};

const Container = styled(FullColorBackground)<{ fontFamily: string; backgroundColor: string }>`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-family: ${props => props.fontFamily};
`;

const CaughtCount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;

  & > label {
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 0.5rem;
    opacity: 0.75;
  }
`;
