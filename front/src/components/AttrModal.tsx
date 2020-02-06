import React, { useState, useCallback, useRef } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import {
  useMyLocalModel,
  useMyLocalModelDispatch,
  Attr as AttrType,
  // Info as InfoType,
} from '../contexts/MyLocalModel';

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
  display: flex;
`;
const SelElem = styled.li`
  display: inline-block;
  flex: 1;
  & > button {
    border: none;
    text-align: center;
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    font-size: 0.7em;
  }
`;

const ImportantButtonWrapper = styled.div`
  display: flex;
  height: 55px;
  & > button {
    border: none;
    text-align: center;
  }
  & > button:nth-child(1) {
    flex: 1;
    color: black;
  }
  & > button:nth-child(2) {
    flex: 1;
    font-weight: bold;
    background-color: rgb(190,0,4);
    color: white;
  }
  & > button:disabled {
    font-weight: normal;
    background-color: rgba(190,0,4, 0.5);
  }
`;

const Preview = styled.div`
  font-size: 2em;
  font-weight: bold;
  word-break: break-all;
`;

const InputBox = styled.div`
  & > input[type='text'] {
    box-sizing: border-box;
    font-size: 2em;
    width: 100%;
  }
`;

const SelButton = styled.button`
  background-color: ${(props: { selected?: boolean }) =>
    props.selected ? 'rgba(190,0,4, 0.5)' : '#eeeeee'};
`;

// [출처] [자바스크립트] 한글 받침 구별 함수
// https://blog.naver.com/azure0777/221414175631
function checkBatchimEnding(word: string) {
  if (word.length === 0) return false;
  var lastLetter = word[word.length - 1];
  var uni = lastLetter.charCodeAt(0);

  if (uni < 44032 || uni > 55203) return false;

  return (uni - 44032) % 28 !== 0;
}

function makeSentence(
  name: string,
  prefixes: string[],
  content: string,
  postfixes: string[],
): string {
  var string = name;
  if (checkBatchimEnding(name)) {
    string += prefixes[0];
  } else {
    string += prefixes[1];
  }
  string += ' ';
  if (content.trim().length === 0) {
    string += '???';
  } else {
    string += content;
  }
  if (checkBatchimEnding(content)) {
    string += postfixes[0];
  } else {
    string += postfixes[1];
  }
  return string + '.';
}

function AttrModal({ name }: { name: string[] }) {
  const dispatch = useMyLocalModelDispatch(); // 마이모델컨텍스트
  const { LocalModel } = useMyLocalModel();
  const contentInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [prefix, setPrefix] = useState(0);
  const [postfix, setPostfix] = useState(0);
  const [content, setContent] = useState('');
  // const [past, togglePast] = useState(false);
  // const [neg, toggleNeg] = useState(false);
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
    // togglePast(false);
    // toggleNeg(false);
    setPreview('');
    setIsBatchimContent(false);
    const body: HTMLElement = document.body;
    body.style.position = ''; // lock 해제
  }

  function afterOpenModal() {
    // 열리고 난 뒤 수행되는 액션을 정의
    setPreview(
      makeSentence(name[0], prefixList[prefix], content, postfixList[postfix]),
    );
    contentInputRef.current.focus();
  }

  function afterCloseModal() {
    // 닫은 뒤 수행되는 액션을 정의.
    // (closeModal)에서 많은 상태변화를 일으켜야 렌더링 횟수가 줄어드므로 쓸 일 없을듯?
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
    ['다', '다'], // 동사형
  ];
  const handleMdoalBodyClick = useCallback(
    (e) => {
      contentInputRef.current.focus();
    },
    [contentInputRef],
  );
  const handlePrefixClick = useCallback(
    (idx: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setPrefix(idx);
      // contentInputRef.current.focus(); => 이벤트 버블링 덕분에 필요 없다.
      setPreview(
        makeSentence(name[0], prefixList[idx], content, postfixList[postfix]),
      );
    },
    [name, postfixList, prefixList, content, postfix],
  );
  const handlePostfixClick = useCallback(
    (idx: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setPostfix(idx);
      // contentInputRef.current.focus(); => 이벤트 버블링 덕분에 필요 없다.
      setPreview(
        makeSentence(name[0], prefixList[prefix], content, postfixList[idx]),
      );
    },
    [content, prefix, name, postfixList, prefixList],
  );
  const handleChangeContent = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setContent(e.target.value);
      setIsBatchimContent(checkBatchimEnding(e.target.value));
      setPreview(
        makeSentence(
          name[0],
          prefixList[prefix],
          e.target.value,
          postfixList[postfix],
        ),
      );
    },
    [prefix, postfix, name, postfixList, prefixList],
  );

  const commitAttrHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const createAttrCallBackHandler = (attr: AttrType) => {
        if (attr !== null) {
          // attr이 실질적으론 안쓰이는거 같은데.
          dispatch({ type: 'CHANGE_INFO', info: LocalModel.getCurrentInfo() });
          // 여기에 인포 수 변화에 수반되는 문제풀기버튼 활성화를 추가해야 한다. 근데 하위 컴포넌트임.
          closeModal();
        } else {
          alert('server error');
        }
      };
      const prefixDecider = checkBatchimEnding(name[0]) ? 0 : 1;
      const postfixDecider = checkBatchimEnding(content) ? 0 : 1;
      LocalModel.createAttr(
        prefixList[prefix][prefixDecider],
        content,
        postfixList[postfix][postfixDecider],
        createAttrCallBackHandler,
      );
    },
    [
      LocalModel,
      content,
      postfixList,
      prefixList,
      prefix,
      postfix,
      name,
      dispatch,
    ],
  );
  return (
    <React.Fragment>
      <button onClick={openModal}>속성 추가</button>
      <Modal
        closeTimeoutMS={200}
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
          <Preview>{preview}</Preview>
          <SelBox>
            {prefixList.map((x, i) => {
              return (
                <SelElem key={'prefix-' + i}>
                  <SelButton
                    onClick={handlePrefixClick(i)}
                    selected={prefix === i}
                  >
                    {isBatchimName ? x[0] : x[1]}
                    {/* {prefix === i && ' ✔'} */}
                  </SelButton>
                </SelElem>
              );
            })}
          </SelBox>
          <InputBox>
            <input
              type="text"
              placeholder="콘텐츠 입력"
              ref={contentInputRef}
              value={content}
              onChange={handleChangeContent}
            />
          </InputBox>
          <SelBox>
            {postfixList.map((x, i) => {
              return (
                <SelElem key={'postfix-' + i}>
                  <SelButton
                    onClick={handlePostfixClick(i)}
                    selected={postfix === i}
                  >
                    {isBatchimContent ? x[0] : x[1]}
                    {i === 0 && '(명사형)'}
                    {i === 4 && '(동사형)'}
                    {/* {postfix === i && ' ✔'} */}
                  </SelButton>
                </SelElem>
              );
            })}
          </SelBox>
          {/* <SelBox>
            <SelElem>
              <SelButton>과거형</SelButton>
            </SelElem>
            <SelElem>
              <SelButton>부정형</SelButton>
            </SelElem>
          </SelBox> */}
          <ImportantButtonWrapper>
            <button onClick={closeModal}>닫기</button>
            <button
              onClick={commitAttrHandler}
              disabled={!content.trim().length}
            >
              저장
            </button>
          </ImportantButtonWrapper>
        </ModalContents>
      </Modal>
    </React.Fragment>
  );
}

export default AttrModal;
