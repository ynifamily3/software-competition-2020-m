import React from 'react';
import { MyLocalModelContextProvider } from './contexts/MyLocalModel';
// import { ModalProvider } from 'react-modal-hook';
import './App.scss';
import Router from './routes/index';

function App() {
  return (
    <MyLocalModelContextProvider>
      <Router />
    </MyLocalModelContextProvider>
  );
}

export default App;
