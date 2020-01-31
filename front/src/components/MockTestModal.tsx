import React, { useState, useCallback, useRef } from 'react';
import Modal from 'react-modal';
import './ModalTransition.scss';
import MockTest from './MockTest';

Modal.setAppElement('#root');

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    width: '100%',
    minwidth: '370px',
    maxWidth: '600px',
    border: 'none',
    borderRadius: 0,
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    boxSizing: 'border-box',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    padding: '0', // 명시적으로 안써주면 20px가 생김
  } as React.CSSProperties, // 이렇게 안하면 이상한 타입 에러 뜬다 https://stackoverflow.com/questions/46710747/type-string-is-not-assignable-to-type-inherit-initial-unset-fixe
};

function MockTestModal(props: any) {
  function afterOpenModal() {
    // 열리고 난 뒤 수행되는 액션을 정의
    const body: HTMLElement = document.body;
    body.style.position = 'fixed';
  }

  function afterCloseModal() {
    const body: HTMLElement = document.body;
    body.style.position = ''; // lock 해제
  }
  const closeTrigger = () => {
    props.setModalIsOpen(false);
  };

  return (
    <Modal
      closeTimeoutMS={200}
      isOpen={props.modalIsOpen}
      style={customStyles}
      contentLabel="MockTestModal"
      onAfterClose={afterCloseModal}
      shouldCloseOnOverlayClick={false}
      onAfterOpen={afterOpenModal}
    >
      <MockTest Mocktest={props.mockTestData} closeHandler={closeTrigger} />
    </Modal>
  );
}

MockTestModal.defaultProps = {
  modalIsOpen: false,
  setModalIsOpen: () => {},
  mockTestData: null,
  setMockTestData: () => {},
};

export default MockTestModal;
