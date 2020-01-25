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

const GnbWrapper = styled.div`
  width: 100%;
  height: 75px;
  background-color: rgb(190, 0, 4);
  display: flex;
  align-items: center;
  padding: 8px;
  color: white;
`;

function Gnb() {
  const MyLocalModel = useMyLocalModel();
  return (
    <GnbWrapper>
      {MyLocalModel.currentPath.reduce((prev, curr) => {
        return prev.concat(' > ').concat(curr);
      }, '> 내 주제 ')}
    </GnbWrapper>
  );
}

export default Gnb;
