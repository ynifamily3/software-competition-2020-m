import React, { useState, useCallback, useRef } from 'react';
import Modal from 'react-modal';
// import Modal from './Modal';
import styled from 'styled-components';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    padding: '8px',
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
  } as React.CSSProperties, // 이렇게 안하면 이상한 타입 에러 뜬다 https://stackoverflow.com/questions/46710747/type-string-is-not-assignable-to-type-inherit-initial-unset-fixe
};

// react에서 styled components 사용시 input tag에서 focus를 잃어버리는 문제
//https://velog.io/@cjy9306/react%EC%97%90%EC%84%9C-styled-components-%EC%82%AC%EC%9A%A9%EC%8B%9C-input-tag%EC%97%90%EC%84%9C-focus%EB%A5%BC-%EC%9E%83%EC%96%B4%EB%B2%84%EB%A6%AC%EB%8A%94-%EB%AC%B8%EC%A0%9C

Modal.setAppElement('#root');

const ModalContents = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const SelBox = styled.ul`
  list-style: none;
  padding: 0;
`;
const SelElem = styled.li``;

const ImportantButtonWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
`;

function AttrModal({ name }: { name: string[] }) {
  // var subtitle: any;
  const contentInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [prefix, setPrefix] = useState(0);
  const [postfix, setPostfix] = useState(0);
  const [content, setContent] = useState('');
  const [past, togglePast] = useState(false);
  const [neg, toggleNeg] = useState(false);
  const [preview, setPreview] = useState('');
  const [isBatchimContent, setIsBatchimContent] = useState(false);
  function openModal() {
    setIsOpen(true);
    const body: HTMLElement = document.body;
    body.style.position = 'fixed'; // 뒤에 내용이 움직이는 걸 방지해 준다. (나중엔 App 영역으로 한정지어 줘야함 . 모달조차 스크롤이 필요할 때를 대비)
  }

  function closeModal() {
    setIsOpen(false);
    setPrefix(0);
    setPostfix(0);
    setContent('');
    togglePast(false);
    toggleNeg(false);
    setPreview('');
    setIsBatchimContent(false);
    const body: HTMLElement = document.body;
    body.style.position = ''; // lock 해제
  }

  function afterOpenModal() {
    // 열리고 난 뒤 수행되는 액션을 정의
    contentInputRef.current.focus();
  }

  function afterCloseModal() {
    // 닫은 뒤 수행되는 액션을 정의.
    // (closeModal)에서 많은 상태변화를 일으켜야 렌더링 횟수가 줄어드므로 쓸 일 없을듯?
  }

  // [출처] [자바스크립트] 한글 받침 구별 함수
  // https://blog.naver.com/azure0777/221414175631
  function checkBatchimEnding(word: string) {
    if (word.length === 0) return false;
    var lastLetter = word[word.length - 1];
    var uni = lastLetter.charCodeAt(0);

    if (uni < 44032 || uni > 55203) return false;

    return (uni - 44032) % 28 !== 0;
  }
  const isBatchimName = checkBatchimEnding(name[0]);
  const prefixList = [
    ['은', '는'],
    ['으로', '로'],
    ['에는', '에는'],
  ];
  const postfixList = [
    ['이다', '다'],
    ['하다', '하다'],
    ['된다', '된다'],
    ['있다', '있다'],
    ['(동사형)다', '(동사형)다'],
  ];
  const handleMdoalBodyClick = useCallback((e) => {
    contentInputRef.current.focus();
  }, []);
  const handlePrefixClick = useCallback(
    (idx: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setPrefix(idx);
      // contentInputRef.current.focus(); => 이벤트 버블링 덕분에 필요 없다.
    },
    [],
  );
  const handlePostfixClick = useCallback(
    (idx: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setPostfix(idx);
      // contentInputRef.current.focus(); => 이벤트 버블링 덕분에 필요 없다.
    },
    [],
  );
  const handleChangeContent = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setContent(e.target.value);
      setIsBatchimContent(checkBatchimEnding(e.target.value));
    },
    [],
  );
  return (
    <React.Fragment>
      <button onClick={openModal}>Attr 추가</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="AttrModal"
        onAfterClose={afterCloseModal}
        shouldCloseOnOverlayClick={false}
        onAfterOpen={afterOpenModal}
      >
        {/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
        <ModalContents onClick={handleMdoalBodyClick}>
          <div>{name[0]}</div>
          <div>
            <SelBox>
              {prefixList.map((x, i) => {
                return (
                  <SelElem key={'prefix-' + i}>
                    <button onClick={handlePrefixClick(i)}>
                      {isBatchimName ? x[0] : x[1]}
                    </button>
                    {prefix === i && 'activated'}
                  </SelElem>
                );
              })}
            </SelBox>
          </div>
          <div>
            <input
              type="text"
              placeholder="콘텐츠 입력"
              ref={contentInputRef}
              value={content}
              onChange={handleChangeContent}
            />
          </div>
          <div>
            <SelBox>
              {postfixList.map((x, i) => {
                return (
                  <SelElem key={'postfix-' + i}>
                    <button onClick={handlePostfixClick(i)}>
                      {isBatchimContent ? x[0] : x[1]}
                    </button>
                    {postfix === i && 'activated'}
                  </SelElem>
                );
              })}
            </SelBox>
          </div>
          <div>
            <div>과거형</div>
            <div>부정형</div>
          </div>
          <ImportantButtonWrapper>
            <button onClick={closeModal}>중요 액션</button>
          </ImportantButtonWrapper>
        </ModalContents>
      </Modal>
    </React.Fragment>
  );
}

export default AttrModal;
