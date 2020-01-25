import React, { useCallback } from 'react';
import styled from 'styled-components';
import {
  useMyLocalModel,
  useMyLocalModelDispatch,
} from '../contexts/MyLocalModel';

// vscode-styled-components 모듈 설치로 문자열화 방지.
const MainWrapper = styled.div`
  width: 100%;
  display: flex;
`;

function Main() {
  const dispatch = useMyLocalModelDispatch();
  const MyLocalModel = useMyLocalModel();
  const handleIntoSubject = useCallback(
    (id: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const moveToSubjectCallBack = (test: any) => {
        console.log(test);
        dispatch({
          type: 'CHANGE_PATH',
          path: MyLocalModel.LocalModel.getCurrentPath(),
        }); // 패스를 체인지한다.
      };
      MyLocalModel.LocalModel.moveToSubject(id, moveToSubjectCallBack);
    },
    [],
  );
  return (
    <MainWrapper>
      <ul>
        {MyLocalModel.subjects.map((x, i) => {
          return (
            <li key={'subjects-' + x.id}>
              <button onClick={handleIntoSubject(x.id)}>{x.name}</button>
            </li>
          );
        })}
      </ul>
    </MainWrapper>
  );
}

export default Main;
