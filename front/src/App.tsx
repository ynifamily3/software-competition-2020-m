import React from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import MySubjects from './pages/MySubjects';
// import ModalBox from './components/ModalBox';
// import Greetings from './components/Greetings';

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <CssBaseline />
        {/* <ModalBox
          subjectWord="재능낭비"
          postpositionWords={['은/는', '으로', '에는']}
          keyPhrase="때때로 많은 돈이 필요"
        /> */}
        <MySubjects />
      </React.Fragment>
    </div>
  );
}

export default App;
