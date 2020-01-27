import React, { useCallback } from 'react';
import styled from 'styled-components';
import {
  useMyLocalModel,
  useMyLocalModelDispatch,
  Attr as AttrType,
  Info as InfoType,
} from '../contexts/MyLocalModel';

import AttrModal from './AttrModal';

// vscode-styled-components 모듈 설치로 문자열화 방지.
const MainWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* text-align: center; */
  box-sizing: border-box;
  position: relative;
`;

const CenterWrapper = styled.div`
  width: 100%;
  max-width: 600px;
`;

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

const Subjects = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
`;
const Subject = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 33%;
  height: 150px;
  box-sizing: border-box;
  background-color: ${(props: { add?: boolean }) =>
    props.add ? 'wheat' : 'rgb(237, 240, 241)'};
  min-width: 120px;
`;

const InfoWrapper = styled.div`
  width: 100%;
`;
const Comment = styled.div``;
const Attrs = styled.div``;
const Attr = styled.div``;
const InfoList = Subjects; // 동률 스타일
const Info = Subject; // 동률 스타일

// const timesRender = (times: number, Node: any): any => {
//   const test = [];
//   for (let i = 0; i < times; i++) test.push(Node);
//   return (
//     <React.Fragment>
//       {test.map((x) => {
//         return Node;
//       })}
//     </React.Fragment>
//   );
// };

function Main() {
  const dispatch = useMyLocalModelDispatch();
  const MyLocalModel = useMyLocalModel();
  const handleIntoSubject = useCallback(
    (id: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const moveToSubjectCallBack = (recvInfo: any) => {
        console.log(recvInfo);
        dispatch({
          type: 'CHANGE_PATH',
          path: MyLocalModel.LocalModel.getCurrentPath(),
        }); // 패스를 체인지한다.
        dispatch({
          type: 'CHANGE_INFO',
          info: recvInfo,
        });
      };
      MyLocalModel.LocalModel.moveToSubject(id, moveToSubjectCallBack);
    },
    [dispatch, MyLocalModel],
  );
  const handleIntoInfo = useCallback(
    (idx: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      MyLocalModel.LocalModel.moveToChild(idx); // 하위 Info으로 이동.
      dispatch({
        type: 'CHANGE_PATH',
        path: MyLocalModel.LocalModel.getCurrentPath(),
      });
      dispatch({
        type: 'CHANGE_INFO',
        info: MyLocalModel.LocalModel.getCurrentInfo(),
      });
    },
    [dispatch, MyLocalModel],
  );

  const handleCreateAndIntoSubject = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!window.confirm('홈으로 돌아오면 모든 내용을 잃습니다.')) return;
      const createdHandler = (info: InfoType) => {
        dispatch({
          type: 'CHANGE_PATH',
          path: MyLocalModel.LocalModel.getCurrentPath(),
        });
        dispatch({
          type: 'CHANGE_INFO',
          info: MyLocalModel.LocalModel.getCurrentInfo(),
        });
        // 제대로 안돔?
      };
      let input_subject: string | undefined | null = prompt('과목 이름은?');
      if (
        typeof input_subject === 'string' &&
        input_subject.trim().length !== 0
      ) {
        MyLocalModel.LocalModel.createSubject(
          input_subject.trim(),
          createdHandler,
        );
      } else {
        alert('유효하지 않는 과목 명입니다.');
      }
    },
    [dispatch, MyLocalModel],
  );

  const handleAddInfo = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const createdHandler = (info: InfoType) => {
        dispatch({
          type: 'CHANGE_PATH',
          path: MyLocalModel.LocalModel.getCurrentPath(),
        });
        dispatch({
          type: 'CHANGE_INFO',
          info: MyLocalModel.LocalModel.getCurrentInfo(),
        });
      };
      let input_info: string | undefined | null = prompt('info 이름은?');
      if (typeof input_info === 'string' && input_info.trim().length !== 0) {
        MyLocalModel.LocalModel.createInfo(input_info.trim(), createdHandler);
      } else {
        alert('유효하지 않는 Info 명입니다.');
      }
    },
    [dispatch, MyLocalModel],
  );
  return (
    <MainWrapper>
      <CenterWrapper>
        {MyLocalModel.currentPath.length === 0 ? (
          <Subjects>
            <Subject add>
              <button onClick={handleCreateAndIntoSubject}>
                [beta] 과목 추가하기
              </button>
            </Subject>
            {MyLocalModel.subjects.map((x, i) => {
              return (
                <Subject key={'subjects-' + x.id}>
                  <div>{x.name}</div>
                  <Button onClick={handleIntoSubject(x.id)}>{'이동'}</Button>
                </Subject>
              );
            })}
          </Subjects>
        ) : (
          <InfoWrapper>
            <Comment>코멘트 : {MyLocalModel.info?.comment}</Comment>
            <Attrs>
              <Attr>
                {MyLocalModel.info?.names && (
                  <AttrModal name={MyLocalModel.info.names} />
                )}
              </Attr>
              {MyLocalModel.info?.attrs.map((x: AttrType, i: number) => {
                return (
                  <Attr key={'Attr-' + i}>
                    {MyLocalModel.info?.names.join(' | ')}
                    {/* info? 와 같이 하면 possible null 발생 안하는듯? 아마 렌더링할지말지 결정 */}
                    {x.prefix + ' '}
                    {x.content}
                    {x.postfix}
                  </Attr>
                );
              })}
            </Attrs>
            <hr />
            <InfoList>
              <Info>
                <button onClick={handleAddInfo}>Info 추가</button>
              </Info>
              {MyLocalModel.info?.childs.map((x: InfoType, i: number) => {
                return (
                  <Info key={'Info-' + i}>
                    {x.names.join(' | ')}
                    <Button danger onClick={handleIntoInfo(i)}>
                      {'하위인포 이동'}
                    </Button>
                  </Info>
                );
              })}
            </InfoList>
          </InfoWrapper>
        )}
      </CenterWrapper>
    </MainWrapper>
  );
}

export default Main;
