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

function MockTest({ Mocktest }: { Mocktest: Mocktest }) {
  const [selection, setSelection] = useState<(string | null)[]>(
    new Array(Mocktest.quests.length).fill(null), // 문제 수만큼 null로 채워진 배열
  );

  const setInvidualFn = (idx: number) => {
    //   console.log('setInvidi호출됐당.' + idx); //6번호출되네..?
    return (value: string) => {
      const newArray = selection.slice();
      console.log('selection', selection);
      console.log('newArray', newArray);
      newArray[idx] = value;
      console.log('idx:', idx, 'value', value);
      console.log('데이터 이상?', newArray);
      setSelection(newArray);
    };
  };
  return (
    <MockTestWrapper>
      <MockTestExit>
        <button>채점</button>
        <button>닫기</button>
      </MockTestExit>
      <MockTestTitle>
        <div>2020학년도 문제지</div>
      </MockTestTitle>
      <MockTestBody>
        {Mocktest.quests.map((x, i) => {
          return (
            <QuestComp
              quest={x}
              key={'quest-' + i}
              order={i + 1}
              setSelectionFn={setInvidualFn(i)}
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
        title: '인생을 왜 사나요?',
        choices: ['죽기 위해서', '살기 위해서', '먹기 위해서', '싸기 위해서'],
        answers: ['죽기 위해서'],
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
        answers: ['죽기 위해서'],
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
