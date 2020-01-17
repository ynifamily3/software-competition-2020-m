import React from 'react';
import styles from './Gnb.module.scss';
import Icon from '@mdi/react'; // https://materialdesignicons.com/
import { mdiRestore, mdiChevronRight, mdiHome } from '@mdi/js';

interface Pathprops {
  path: string[];
}

function Gnb({ path }: Pathprops) {
  return (
    <div className={styles['gnb--wrapper']}>
      <div className={styles['gnb--path']}>
        {path.map((x, i) => {
          return (
            <React.Fragment key={'gnb-'.concat(i.toString())}>
              <Icon
                className={styles['gnb--arrow']}
                path={mdiChevronRight}
                // size prop 제거 (scss에서 사용)
                title="arrow"
                rotate={0}
                color="white"
              />
              <div className={styles['gnb--pathname']}>{x}</div>
            </React.Fragment>
          );
        })}
      </div>
      <div className={styles['gnb--right']}>
        <div className={styles['gnb--icon-button']}>
          <Icon
            path={mdiRestore}
            title="돌아가기"
            size={1}
            rotate={0}
            color="white"
          />
        </div>
        <div className={styles['gnb--icon-button']}>
          <Icon
            path={mdiHome}
            title="홈으로"
            size={1}
            rotate={0}
            color="white"
          />
        </div>
      </div>
    </div>
  );
}

Gnb.defaultProps = {
  path: ['내 주제'],
};

export default Gnb;
