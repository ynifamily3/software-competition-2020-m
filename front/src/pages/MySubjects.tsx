import React from 'react';
import Gnb from '../components/Gnb';
import Icon from '@mdi/react'; // https://materialdesignicons.com/
import {
  mdiPencil,
  mdiFileDocumentBoxOutline,
  mdiFileDocumentBoxPlusOutline,
  mdiPlus,
} from '@mdi/js';

import styles from './MySubjects.module.scss';

function MySubjects() {
  return (
    <div className={styles['MySubjects']}>
      <header>
        <Gnb />
      </header>
      <article className={styles['MySubjects--article']}>
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

          <li>
            <Icon
              path={mdiPencil}
              size={1}
              // size prop 제거 (scss에서 사용)
              title="arrow"
              rotate={0}
              color="black"
            />
            <span>인생에 도움이 되지 않는다.</span>
          </li>
          <li>
            <Icon
              path={mdiPencil}
              size={1}
              // size prop 제거 (scss에서 사용)
              title="arrow"
              rotate={0}
              color="black"
            />
            <span>인생에 도움이 되지 않는다.</span>
          </li>
          <li>
            <Icon
              path={mdiPencil}
              size={1}
              // size prop 제거 (scss에서 사용)
              title="arrow"
              rotate={0}
              color="black"
            />
            <span>인생에 도움이 되지 않는다.</span>
          </li>
          <li>
            <Icon
              path={mdiPencil}
              size={1}
              // size prop 제거 (scss에서 사용)
              title="arrow"
              rotate={0}
              color="black"
            />
            <span>인생에 도움이 되지 않는다.</span>
          </li>
          <li>
            <Icon
              path={mdiPencil}
              size={1}
              // size prop 제거 (scss에서 사용)
              title="arrow"
              rotate={0}
              color="black"
            />
            <span>인생에 도움이 되지 않는다.</span>
          </li>
          <li>
            <Icon
              path={mdiPencil}
              size={1}
              // size prop 제거 (scss에서 사용)
              title="arrow"
              rotate={0}
              color="black"
            />
            <span>인생에 도움이 되지 않는다.</span>
          </li>
          <li>
            <Icon
              path={mdiPencil}
              size={1}
              // size prop 제거 (scss에서 사용)
              title="arrow"
              rotate={0}
              color="black"
            />
            <span>인생에 도움이 되지 않는다.</span>
          </li>
          <li>
            <Icon
              path={mdiPencil}
              size={1}
              // size prop 제거 (scss에서 사용)
              title="arrow"
              rotate={0}
              color="black"
            />
            <span>인생에 도움이 되지 않는다.</span>
          </li>
          <li>
            <Icon
              path={mdiPencil}
              size={1}
              // size prop 제거 (scss에서 사용)
              title="arrow"
              rotate={0}
              color="black"
            />
            <span>인생에 도움이 되지 않는다.</span>
          </li>
          <li>
            <Icon
              path={mdiPencil}
              size={1}
              // size prop 제거 (scss에서 사용)
              title="arrow"
              rotate={0}
              color="black"
            />
            <span>인생에 도움이 되지 않는다.</span>
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
        <input type="search" placeholder="설명 추가하기..." />
        <ul>
          <li>
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
              <div>역사</div>
            </div>
          </li>
          <li>방법론</li>
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
        <div className={styles['Mysubjects--solve-button-wrapper']}>
          <button className={styles['Mysubjects--solve-button']}>
            문제풀기
          </button>
        </div>
      </article>
      <footer className={styles['MySubjects--footer']}>
        <div className={styles['MySubjects--adviewer']}>
          {/* <img src="/image2.jpeg" /> */}
        </div>
      </footer>
    </div>
  );
}

export default MySubjects;
