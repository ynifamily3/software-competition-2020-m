import React from 'react';
import Gnb from '../components/Gnb';
import Icon from '@mdi/react'; // https://materialdesignicons.com/

import {
  // eslint-disable-next-line
  mdiPencil,
  mdiFileDocumentBoxOutline,
  mdiFileDocumentBoxPlusOutline,
  mdiPlus,
} from '@mdi/js';

import styles from './MySubjects.module.scss';

interface Chilprops {
  docs: string[];
}

function Attrs({ children }: any) {
  return <React.Fragment>{children}</React.Fragment>;
}

function Attr({ children }: any) {
  return <li>{children}</li>;
}

function Chils({ docs }: Chilprops) {
  return (
    <ul>
      {docs.map((x, i) => {
        return (
          <li key={'docs--'.concat(i.toString())}>
            <div>
              <div>
                <Icon
                  path={mdiFileDocumentBoxOutline}
                  size={1}
                  // size prop 제거 (scss에서 사용)
                  title="arrow"
                  rotate={0}
                  color="black"
                />
              </div>
              <div>{x}</div>
            </div>
          </li>
        );
      })}
      <li>
        <div>
          <div>
            <Icon
              path={mdiFileDocumentBoxPlusOutline}
              size={1}
              // size prop 제거 (scss에서 사용)
              title="arrow"
              rotate={0}
              color="black"
            />
          </div>
          <div>새 주제</div>
        </div>
      </li>
    </ul>
  );
}

function MySubjects(props: any) {
  return (
    <div className={styles['MySubjects']}>
      <header>
        <Gnb />
      </header>
      <article className={styles['MySubjects--article']}>
        <Attrs>
          <ul>
            <Attr>즐겁다</Attr>
            <Attr>인생에 도움이 안 된다.</Attr>
          </ul>
          <span>
            <Icon
              path={mdiPlus}
              size={1}
              // size prop 제거 (scss에서 사용)
              title="arrow"
              rotate={0}
              color="black"
            />
          </span>
          <input type="search" placeholder="설명 추가하기..." />
        </Attrs>
        {/*         
        <ul>
          <li>
            <Icon
              path={mdiPencil}
              size={1}
              // size prop 제거 (scss에서 사용)
              title="arrow"
              rotate={0}
              color="black"
            />
            <span>즐겁다</span>
          </li>
        </ul>
        <span>
          <Icon
            path={mdiPlus}
            size={1}
            // size prop 제거 (scss에서 사용)
            title="arrow"
            rotate={0}
            color="black"
          />
        </span>
        <input type="search" placeholder="설명 추가하기..." /> */}
        <Chils docs={['역사']} />
        <div className={styles['Mysubjects--solve-button-wrapper']}>
          <button className={styles['Mysubjects--solve-button']}>
            문제풀기
          </button>
        </div>
      </article>
      <footer className={styles['MySubjects--footer']}>
        <div className={styles['MySubjects--adviewer']}>
          <img src="/image2.jpeg" alt="광고" />
        </div>
      </footer>
    </div>
  );
}

export default MySubjects;
