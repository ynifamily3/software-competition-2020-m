import React, { useCallback } from 'react';
import styled from 'styled-components';
import {
  useMyLocalModel,
  useMyLocalModelDispatch,
} from '../contexts/MyLocalModel';

// vscode-styled-components 모듈 설치로 문자열화 방지.

const GnbWrapper = styled.div`
  width: 100%;
  height: 40px;
  background-color: rgb(190, 0, 4);
  display: flex;
  align-items: center;
  padding: 8px;
  color: white;
  box-sizing: border-box;
  & > div:first-child {
    flex: 1;
  }
  & > div > button {
    all: unset;
    margin: auto 1em;
  }
  .path {
    margin: 0;
    text-decoration: underline;
    cursor: pointer;
  }
  .path:last-child {
    text-decoration: none;
    cursor: auto;
  }
  & > div > button > img {
    cursor: pointer;
    height: 1.5em;
  }
`;

function Gnb() {
  const MyLocalModel = useMyLocalModel();
  const dispatch = useMyLocalModelDispatch();
  const handleExitToMainPageButton = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      MyLocalModel.LocalModel.exitToMainPage();
      dispatch({ type: 'CHANGE_PATH', path: [] });
    },
    [dispatch, MyLocalModel],
  );
  const handleGoToUpperPageButton = useCallback(
    (count: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      var info;
      if (count === 0) return;
      while (count--) {
        info = MyLocalModel.LocalModel.moveToParent();
      }
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
        {MyLocalModel.currentPath.reduce(
          (prev, curr, index) => {
            return (
              <React.Fragment>
                {prev} >{' '}
                <button
                  className="path"
                  onClick={handleGoToUpperPageButton(
                    MyLocalModel.currentPath.length - index - 1,
                  )}
                >
                  {curr}
                </button>
              </React.Fragment>
            );
          },
          <React.Fragment>
            >{' '}
            <button className="path" onClick={handleExitToMainPageButton}>
              내 주제
            </button>
          </React.Fragment>,
        )}
      </div>
      <div>
        {MyLocalModel.currentPath.length >= 2 && (
          <button onClick={handleGoToUpperPageButton(1)}>
            <img src="/back.png" alt="뒤로" title="뒤로" />
          </button>
        )}
      </div>
      <div>
        {MyLocalModel.currentPath.length !== 0 && (
          <button onClick={handleExitToMainPageButton}>
            <img src="/home.png" alt="홈으로" title="홈으로" />
          </button>
        )}
      </div>
    </GnbWrapper>
  );
}

export default Gnb;
