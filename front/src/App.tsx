import React, { useEffect, useState } from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import MySubjects from './pages/MySubjects';
// import ModalBox from './components/ModalBox';
// import Greetings from './components/Greetings';

import LocalModel from './libs/localmodel';

const model = new LocalModel(true);
interface Subjectsprops {
  name: string;
  id: number;
}
function App() {
  const [subjects, setSubjects] = useState<Subjectsprops[] | null>(null);
  function getSubjectsListCallBack(payload: Subjectsprops[]) {
    console.log(typeof payload);
    setSubjects(payload);
  }
  useEffect(() => {
    // function o_o(f: any) {
    //   console.log(f);
    // }
    model.getSubjectsList(getSubjectsListCallBack); // 전체 App의 정보를 가져옴.
    // model.moveToSubject(1, o_o);
  }, []);
  console.log('re-render');
  return (
    <div className="App">
      <React.Fragment>
        <CssBaseline />
        {/* <ModalBox
          subjectWord="재능낭비"
          postpositionWords={['은/는', '으로', '에는']}
          keyPhrase="때때로 많은 돈이 필요"
        /> */}
        {subjects ? <MySubjects model={model} subjects={subjects} /> : null}
      </React.Fragment>
    </div>
  );
}

export default App;
