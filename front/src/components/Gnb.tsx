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
      if (!window.confirm('[beta] 홈으로 이동하면 모든 내용을 잃습니다.'))
        return;
      MyLocalModel.LocalModel.exitToMainPage();
      dispatch({ type: 'CHANGE_PATH', path: [] });
    },
    [dispatch, MyLocalModel],
  );
  const handleGoToUpperPageButton = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      var info = MyLocalModel.LocalModel.moveToParent();
      dispatch({
        type: 'CHANGE_PATH',
        path: MyLocalModel.LocalModel.getCurrentPath(),
      });
      dispatch({ type: 'CHANGE_INFO', info });
    },
    [dispatch, MyLocalModel],
  );
  return (
    <GnbWrapper>
      <div>
        {MyLocalModel.currentPath.reduce((prev, curr) => {
          return prev.concat(' > ').concat(curr);
        }, '> 내 주제 ')}
      </div>
      <div>
        {MyLocalModel.currentPath.length >= 2 && (
          <button onClick={handleGoToUpperPageButton}>상위 Info로</button>
        )}
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
