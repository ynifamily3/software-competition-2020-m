import React, { useEffect, useState } from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import MySubjects from './pages/MySubjects';
// import ModalBox from './components/ModalBox';
// import Greetings from './components/Greetings';

import LocalModel from './libs/localmodel';

const model = new LocalModel(true);

function App() {
  const [subjects, setSubjects] = useState(null);
  function getSubjectsListCallBack(payload: any) {
    console.log(payload);
    setSubjects(payload);
  }
  useEffect(() => {
    model.getSubjectsList(getSubjectsListCallBack); // 전체 App의 정보를 가져옴.
  }, []);
  console.log('re-render');
  return (
    <div className="App">
      <div>{Math.random()}</div>
      <React.Fragment>
        <CssBaseline />
        {/* <ModalBox
          subjectWord="재능낭비"
          postpositionWords={['은/는', '으로', '에는']}
          keyPhrase="때때로 많은 돈이 필요"
        /> */}
        {subjects ? <MySubjects subjects={subjects} /> : null}
      </React.Fragment>
    </div>
  );
}

export default App;
