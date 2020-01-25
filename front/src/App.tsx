import React from 'react';
import { MyLocalModelContextProvider } from './contexts/MyLocalModel';
import './App.scss';
import AppIn from './AppIn';

function App() {
  return (
    <MyLocalModelContextProvider>
      <AppIn />
    </MyLocalModelContextProvider>
  );
}

export default App;
