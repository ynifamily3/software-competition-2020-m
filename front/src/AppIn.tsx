import React, { useEffect } from 'react';
import {
  useMyLocalModelDispatch,
  useMyLocalModel,
} from './contexts/MyLocalModel';

import Gnb from './components/Gnb';
import Main from './components/Main';
// import MockTest from './components/MockTest';

function AppIn() {
  const { LocalModel } = useMyLocalModel();
  const dispatch = useMyLocalModelDispatch();
  // 앱이 로드되면 다음 액션들을 차례로 디스패치함.
  useEffect(() => {
    if (LocalModel.wp !== null) return; // 최상단이 아니면 아래의 액션들은 실행할 필요가 없습니다.
    // console.log('메인으로 옴. 주제 리스트를 뽑아옵니다.');
    // 이 부분은 한번 호출되어서
    const getSubjectsListCallBack = (recv: any) => {
      // console.log(recv);
      dispatch({
        type: 'CHANGE_SUBJECTS',
        subjects: recv,
      });
    };
    LocalModel.getSubjectsList(getSubjectsListCallBack);
  }, [LocalModel, dispatch, LocalModel.wp]);
  return (
    <div className="App" onClick={(e) => e.preventDefault()}>
      <Gnb />
      <Main />
      {/* <MockTest /> */}
    </div>
  );
}

export default AppIn;
