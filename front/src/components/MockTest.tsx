import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { Info } from '../contexts/MyLocalModel';
import QuestComp from './Quest';

export interface Quest {
  type: 'binary' | 'selection' | 'short';
  title: string;
  statement: string | null;
  choices: string[];
  answers: string[];
  materials: Info | null; // 직접적으론 필요없을수도 있어서.
}

export interface Mocktest {
  quests: Quest[];
}

// style //
const MockTestWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  background-color: white;
  padding-bottom: 66px;
  margin-bottom: 74px;
  overflow: scroll;
  height: 100%;
`;

const MockTestTitle = styled.div`
  border-bottom: 1px solid black;
  font-size: 2em;
  padding: 30px 0;
  margin-bottom: 66px;
  text-align: center;
`;

const MockTestBody = styled.ul`
  list-style: none;
  padding: 0;
`;

const MockTestExit = styled.div`
  text-align: center;
  background-color: wheat;
  position: fixed;
  right: 0;
  width: 100%;
  max-width: 600px;
  height: 74px;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  & > button {
    border: none;
    text-align: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  & > button:nth-child(1) {
    flex: 1;
    color: black;
    background-color: #eaeaea;
  }
  & > button:nth-child(2) {
    flex: 1;
    font-weight: bold;
    background-color: rgb(24, 109, 238);
    color: white;
  }
  & > button:disabled {
    font-weight: normal;
    background-color: rgba(24, 109, 238, 0.5);
  }
`;

function MockTest({
  Mocktest,
  closeHandler,
}: {
  Mocktest: Mocktest;
  closeHandler: Function;
}) {
  const [selection, setSelection] = useState<(string | null)[]>(
    new Array(Mocktest.quests.length).fill(null), // 문제 수만큼 null로 채워진 배열
  );

  // const setInvidualFn = (idx: number) => {
  //   return (value: string) => {
  //     const newArray = selection.slice();
  //     newArray[idx] = value;
  //     setSelection(newArray);
  //   };
  // };

  const closeClickHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      closeHandler();
    },
    [],
  );
  return (
    <MockTestWrapper>
      <MockTestExit>
        <button>채점</button>
        <button onClick={closeClickHandler}>닫기</button>
      </MockTestExit>
      <MockTestTitle>
        <div>2020학년도 문제지</div>
        <div>{selection}</div>
      </MockTestTitle>
      <MockTestBody>
        {Mocktest.quests.map((x, i) => {
          return (
            <QuestComp
              quest={x}
              key={'quest-' + i}
              order={i}
              selection={selection}
              setSelectionFn={setSelection}
            />
          );
        })}
      </MockTestBody>
    </MockTestWrapper>
  );
}

MockTest.defaultProps = {
  Mocktest: {
    quests: [
      {
        type: 'binary',
        title: '(Demo) 다음 문장의 참/거짓을 판별하시오.',
        statement: '무봉리순대국밥은 얼큰한 국물이 인상적이다.',
        choices: ['T', 'F'],
        answers: ['F'],
        materials: null,
      },
      {
        type: 'selection',
        title: '다음 중 소고기국밥에 대한 설명으로 옳은 것을 고르시오.',
        choices: [
          '실제로는 없는 브랜드이다.',
          '순대가 들어있다.',
          '얼큰한 국물이 인상적이다.',
          '어쩌면 하나쯤은 있을수도있다.',
        ],
        answers: ['0'],
        materials: null,
      },
      {
        type: 'short',
        title: '1+1=',
        choices: [],
        answers: ['2'],
        materials: null,
      },
      {
        type: 'selection',
        title: '인생을 왜 사나요?',
        choices: ['죽기 위해서', '살기 위해서', '먹기 위해서', '싸기 위해서'],
        answers: ['1'],
        materials: null,
      },
      {
        type: 'short',
        title: '1+1=',
        choices: [],
        answers: ['2'],
        materials: null,
      },
    ],
  },
};

export default MockTest;
