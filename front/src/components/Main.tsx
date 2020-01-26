import React, { useCallback } from 'react';
import styled from 'styled-components';
import {
  useMyLocalModel,
  useMyLocalModelDispatch,
  Attr as AttrType,
  Info as InfoType,
} from '../contexts/MyLocalModel';

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
  background-color: rgb(237, 240, 241);
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
  return (
    <MainWrapper>
      <CenterWrapper>
        {MyLocalModel.currentPath.length === 0 ? (
          <Subjects>
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
              {MyLocalModel.info?.childs.map((x: InfoType, i: number) => {
                return (
                  <Info key={'Info-' + i}>
                    {x.names.join(' | ')}
                    <Button danger>{'하위인포 이동'}</Button>
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
