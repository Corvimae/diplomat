import styled from 'styled-components';

export const FullColorBackground = styled.div<{ backgroundColor: string }>`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: ${props => props.backgroundColor};
`;