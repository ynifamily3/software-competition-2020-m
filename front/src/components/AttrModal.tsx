import React from 'react';
import ReactModal from 'react-modal';
import { useModal } from 'react-modal-hook';

function AttrModal() {
  // https://www.npmjs.com/package/react-modal
  const [showModal, hideModal] = useModal(() => (
    <ReactModal isOpen>
      <p>Modal content</p>
      <button onClick={hideModal}>Hide</button>
    </ReactModal>
  ));
  return <button onClick={showModal}>Attr 추가</button>;
}

export default AttrModal;
