import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Quest as QuestType } from './MockTest';

// style //

const QuestElem = styled.li`
  display: flex;
  flex-direction: column;
  word-break: break-all;
  padding: 0 1.5em;
  & + & {
    margin-top: 3em;
  }
`;

const Statement = styled.div`
  display: ${(props: { statement?: string | null }) =>
    props.statement ? 'block' : 'none'};
  border: 1px solid black;
  margin-top: 1em;
  padding: 1em;
`;

const Selection = styled.div`
  & > label {
    /* padding-left: 0.7em; */
    /* flex: 1; */
    width: 100%;
    height: 100%;
    padding: 1em;
  }
  /* & > label:hover,
  label:active {
    background-color: rgb(111, 197, 237);
  } */
  & > label > span {
    padding-left: 0.7em;
  }
  & > label > input[type='radio'] {
    /* position: absolute; */
    /* left: -9999px; */
  }
  display: flex;

  background-color: ${(props: { selected?: boolean }) =>
    props.selected ? 'wheat' : 'rgb(235,235,235)'};
  margin-top: 1em;
`;

const InputAnswer = styled.div`
  width: 100%;
  margin-top: 1em;
  & > input[type='text'] {
    width: 100%;
    padding: 0;
    border-width: 0;
    box-sizing: border-box;
    border: 1px solid black;
    padding: 1em;
  }
`;

//       //

function QuestComp({
  quest,
  order,
  setSelectionFn,
  selection,
}: {
  quest: QuestType;
  order: number;
  setSelectionFn: Function;
  selection: (string | null)[];
}) {
  // console.log('render questcomp');
  const setValueAsync = (value: string) => {
    var newArr = selection.slice();
    newArr[order] = value;
    setSelectionFn(newArr);
  };
  const { type, title, statement, choices, answers, materials } = quest;
  const onChange2 = useCallback(
    (value: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      // console.log('passed to change evt'); // only once
      setValueAsync(value);
    },
    [selection],
  );
  const onClick2 = (value: string) => (
    //useCallback(
    e: React.MouseEvent<HTMLLabelElement, MouseEvent>,
  ) => {
    var test = e.currentTarget;
    test.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    e.stopPropagation(); // 안에 있는 radio event의 Propagation 을 방지
    // console.log('click!'); // 두번 되네? 왜지?
    // setValueAsync(value); //=> 앤또 왜없어도돼지?
  };
  // [selection],
  //);

  const inputChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValueAsync(e.target.value);
    },
    [selection], // dep가 중요
  );
  // console.log(statement?.trim());
  return (
    <QuestElem>
      <div>
        {order + 1 + '. '}
        {title}
      </div>
      <Statement statement={statement}>
        {statement
          ?.trim()
          .split('\n')
          .reduce<any>((a, b) => {
            return (
              <React.Fragment>
                {a && a}
                {a && <br />}
                {b}
              </React.Fragment>
            );
          }, '')}
      </Statement>
      {choices.length !== 0 ? (
        choices.map((x, i) => {
          return (
            <Selection
              key={'select-id' + order + '-' + i}
              selected={
                type === 'binary'
                  ? selection[order] === x
                  : selection[order] === '' + i
              }
            >
              <label
                onClick={onClick2(type !== 'binary' ? '' + i : x)}
                htmlFor={'select-' + order + '-' + i}
              >
                <input
                  type="radio"
                  id={'select-' + order + '-' + i}
                  name={'select-' + order}
                  onChange={onChange2(type !== 'binary' ? '' + i : x)}
                  checked={
                    type === 'binary'
                      ? selection[order] === x
                      : selection[order] === '' + i
                  }
                />
                <span>
                  {type === 'binary' ? (x === 'T' ? '참' : '거짓') : x}
                </span>
              </label>
            </Selection>
          );
        })
      ) : (
        <InputAnswer>
          <input
            type="text"
            placeholder="정답 입력"
            value={
              selection[order] === null ? '' : selection[order]?.toString()
            }
            onChange={inputChangeHandler}
          />
        </InputAnswer>
      )}
    </QuestElem>
  );
}

export default QuestComp;
