import React, { useEffect } from 'react';
import {
  useMyLocalModelDispatch,
  useMyLocalModel,
} from './contexts/MyLocalModel';

import Gnb from './components/Gnb';
import Main from './components/Main';

function AppIn() {
  const { LocalModel } = useMyLocalModel();
  const dispatch = useMyLocalModelDispatch();
  // 앱이 로드되면 다음 액션들을 차례로 디스패치함.
  const getSubjectsListCallBack = (recv: any) => {
    console.log(recv);
    dispatch({
      type: 'CHANGE_SUBJECTS',
      subjects: recv,
    });
  };
  useEffect(() => {
    dispatch({
      type: 'CHANGE_PATH',
      path: LocalModel.getCurrentPath(),
    });
    LocalModel.getSubjectsList(getSubjectsListCallBack);
  }, [dispatch]);
  return (
    <div className="App">
      <Gnb />
      <Main />
    </div>
  );
}

export default AppIn;
