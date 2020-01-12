import React from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import MySubjects from './pages/MySubjects';

import Greetings from './components/Greetings';

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <CssBaseline />
        <MySubjects />
        <Greetings name="Miel" optional="옵셔널" />
      </React.Fragment>
    </div>
  );
}

export default App;
