import React from 'react';
import styled from 'styled-components';
import { useMyLocalModel } from '../contexts/MyLocalModel';

// vscode-styled-components 모듈 설치로 문자열화 방지.
const Button = styled.button`
  border-radius: 50px;
  padding: 5px;
  min-width: 120px;
  color: white;
  font-weight: 600;
  -webkit-appearance: none;
  cursor: pointer;
  &:active,
  &:focus {
    outline: none;
  }
  background-color: ${(props: { danger?: boolean }) =>
    props.danger ? 'red' : 'purple'};
`;

function Gnb() {
  const MyLocalModel = useMyLocalModel();
  return (
    <div>
      {MyLocalModel.test}
      <Button>Hello</Button>
      <Button danger>Warn</Button>
    </div>
  );
}

export default Gnb;
