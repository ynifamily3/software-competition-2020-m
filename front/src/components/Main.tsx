import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import {
  useMyLocalModel,
  useMyLocalModelDispatch,
  Attr as AttrType,
  Info as InfoType,
} from '../contexts/MyLocalModel';

import AttrModal from './AttrModal';
import MockTestModal from './MockTestModal';

// vscode-styled-components 모듈 설치로 문자열화 방지.
const MainWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
    props.danger ? 'rgb(190,0,4)' : 'purple'};
`;

const Subjects = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: 105px;
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
// const Comment = styled.div``;
const Attrs = styled.div`
  display: flex;
  flex-direction: column;
`;
const Attr = styled.div`
  padding: 15px 0;
  & > img {
    width: 1em;
    margin-right: 1em;
  }
`;
const InfoList = Subjects; // 동률 스타일
const Info = Subject; // 동률 스타일

const CreateProblemWrapper = styled.div`
  text-align: center;
  width: 90%;
  max-width: 600px;
  height: 75px;
  position: fixed;
  background-color: wheat;
  bottom: -15px;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
`;
const CreateProblemButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  text-align: center;
  box-sizing: border-box;
  font-size: 1.5em;
  font-weight: bold;
  background-color: rgb(190, 0, 4);
  color: white;
  &:disabled {
    font-weight: normal;
    background-color: rgba(190, 0, 4, 0.5);
  }
`;

function Main() {
  const dispatch = useMyLocalModelDispatch();
  const MyLocalModel = useMyLocalModel();

  /// Mocktest Modal Control state
  const [isOpenMockTest, setIsOpenMockTest] = useState<boolean>(false);
  const [mockTestData, setMockTestData] = useState<any>(null);
  /// End-of Mocktest Modal Control state

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
        // setCanSolveProblem(recvInfo.attrs.length > 0); // 문제풀이 가능여부 state를 바꾼다..
      };
      MyLocalModel.LocalModel.moveToSubject(id, moveToSubjectCallBack);
    },
    [dispatch, MyLocalModel],
  );
  const handleIntoInfo = useCallback(
    (idx: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      MyLocalModel.LocalModel.moveToChild(idx); // 하위 Info으로 이동.
      const savedInfo = MyLocalModel.LocalModel.getCurrentInfo();
      dispatch({
        type: 'CHANGE_PATH',
        path: MyLocalModel.LocalModel.getCurrentPath(),
      });
      dispatch({
        type: 'CHANGE_INFO',
        info: savedInfo,
      });
      // setCanSolveProblem(savedInfo.attrs.length > 0); // 문제풀이 가능여부 state를 바꾼다..
    },
    [dispatch, MyLocalModel],
  );

  const handleCreateAndIntoSubject = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const createdHandler = (info: InfoType) => {
        const savedInfo = MyLocalModel.LocalModel.getCurrentInfo();
        dispatch({
          type: 'CHANGE_PATH',
          path: MyLocalModel.LocalModel.getCurrentPath(),
        });
        dispatch({
          type: 'CHANGE_INFO',
          info: savedInfo,
        });
        // setCanSolveProblem(savedInfo.attrs.length > 0); // 문제풀이 가능여부 state를 바꾼다..
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
        // alert('유효하지 않는 과목 이름입니다.');
      }
    },
    [dispatch, MyLocalModel],
  );

  const handleAddInfo = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const createdHandler = (info: InfoType) => {
        const savedInfo = MyLocalModel.LocalModel.getCurrentInfo();
        dispatch({
          type: 'CHANGE_PATH',
          path: MyLocalModel.LocalModel.getCurrentPath(),
        });
        dispatch({
          type: 'CHANGE_INFO',
          info: savedInfo,
        });
        // setCanSolveProblem(savedInfo.attrs.length > 0); // 문제풀이 가능여부 state를 바꾼다..
      };
      let input_info: string | undefined | null = prompt('정보 이름은?');
      if (typeof input_info === 'string' && input_info.trim().length !== 0) {
        MyLocalModel.LocalModel.createInfo(input_info.trim(), createdHandler);
      } else {
        // alert('유효하지 않는 정보 이름입니다.');
      }
    },
    [dispatch, MyLocalModel],
  );

  const handleCreateMockTest = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setMockTestData(MyLocalModel.LocalModel.createMocktest(5));
      setIsOpenMockTest(true);
    },
    [MyLocalModel],
  );

  return (
    <MainWrapper>
      <CenterWrapper>
        {MyLocalModel.currentPath.length === 0 ? (
          <Subjects>
            <Subject add>
              <button onClick={handleCreateAndIntoSubject}>과목 추가</button>
            </Subject>
            {MyLocalModel.subjects.map((x, i) => {
              return (
                <Subject key={'subjects-' + x.id}>
                  <div>{x.name}</div>
                  <Button onClick={handleIntoSubject(x.id)}>이동</Button>
                </Subject>
              );
            })}
          </Subjects>
        ) : (
          <InfoWrapper>
            {/* <Comment>코멘트 : {MyLocalModel.info?.comment}</Comment> */}
            <Attrs>
              <Attr>
                {MyLocalModel.info?.names && (
                  <AttrModal name={MyLocalModel.info.names} />
                )}
              </Attr>
              {MyLocalModel.info?.attrs.map((x: AttrType, i: number) => {
                return <Attr key={'Attr-' + i}><img src="/pencil.png"/>{x.getFullSentence()}</Attr>;
              })}
            </Attrs>
            <hr />
            <InfoList>
              <Info>
                <button onClick={handleAddInfo}>정보 추가</button>
              </Info>
              {MyLocalModel.info?.childs.map((x: InfoType, i: number) => {
                return (
                  <Info key={'Info-' + i}>
                    {x.names.join(' | ')}
                    <Button danger onClick={handleIntoInfo(i)}>
                      {'하위 정보 이동'}
                    </Button>
                  </Info>
                );
              })}
            </InfoList>
            <CreateProblemWrapper>
              <CreateProblemButton
                disabled={MyLocalModel.info?.attrs.length === 0}
                onClick={handleCreateMockTest}
              >
                문제 풀기
              </CreateProblemButton>
              <MockTestModal
                modalIsOpen={isOpenMockTest && mockTestData !== null}
                setMockTestData={setMockTestData}
                setModalIsOpen={setIsOpenMockTest}
                mockTestData={mockTestData}
              />
            </CreateProblemWrapper>
          </InfoWrapper>
        )}
      </CenterWrapper>
    </MainWrapper>
  );
}

export default Main;
