import React, { useCallback } from 'react';
import styled from 'styled-components';
import {
  useMyLocalModel,
  useMyLocalModelDispatch,
} from '../contexts/MyLocalModel';

// vscode-styled-components 모듈 설치로 문자열화 방지.

const GnbWrapper = styled.div`
  width: 100%;
  height: 75px;
  background-color: rgb(190, 0, 4);
  display: flex;
  align-items: center;
  padding: 8px;
  color: white;
  box-sizing: border-box;
  & > div:first-child {
    flex: 1;
  }
`;

function Gnb() {
  const MyLocalModel = useMyLocalModel();
  const dispatch = useMyLocalModelDispatch();
  const handleExitToMainPageButton = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      dispatch({ type: 'CHANGE_PATH', path: [] });
      // 나중에 Infos도 바꿔랑.
    },
    [dispatch],
  );
  return (
    <GnbWrapper>
      <div>
        {MyLocalModel.currentPath.reduce((prev, curr) => {
          return prev.concat(' > ').concat(curr);
        }, '> 내 주제 ')}
      </div>
      <div>
        {MyLocalModel.currentPath.length !== 0 && (
          <button onClick={handleExitToMainPageButton}>홈으로</button>
        )}
      </div>
    </GnbWrapper>
  );
}

export default Gnb;
