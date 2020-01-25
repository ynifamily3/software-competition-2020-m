import React, { useEffect } from 'react';
import LocalModel from './libs/localmodel';
import { MyLocalModelContextProvider } from './contexts/MyLocalModel';
import './App.scss';

import Gnb from './components/Gnb';

const model = new LocalModel(true);

function App() {
  useEffect(() => {
    function o_o(f: any) {
      // 로딩을 풀고 상황에 맞는 디스패치를 하면 된다.
    }
    model.getSubjectsList(o_o); // 전체 App의 정보를 가져옴.
    // model.moveToSubject(1, o_o);
  }, []);

  return (
    <MyLocalModelContextProvider>
      <div className="App">
        <Gnb />
      </div>
    </MyLocalModelContextProvider>
  );
}

export default App;
