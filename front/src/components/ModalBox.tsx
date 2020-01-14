import React, { useState, Fragment, useCallback } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import './ModalBox.module.scss';
// import Input from '@material-ui/core/Input';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modalWrapper: {
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,.3)',
    },
    modal: {
      width: '80%',
      height: '300px',
      color: theme.palette.warning.light,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: 'rgba(63,63,63,1)',
      flexDirection: 'column',
      padding: '1em',
    },
    subjectWord: {
      flex: 3,
      textAlign: 'center',
    },
    modalLine: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      minHeight: '30px',
      alignItems: 'center',
    },
    postpositionWords: {
      display: 'flex',
      flexDirection: 'row',
      flex: 7,
      justifyContent: 'space-around',
    },
    postpositionWord: {
      color: theme.palette.info.light,
      border: '1px solid white',
      borderRadius: '1em',
      padding: '1em',
    },
    search: {
      all: 'unset',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      border: '1px solid #000',
      width: '100%',
      height: '40px',
      padding: '1em',
    },
    keyPhrase: {
      width: '100%',
    },
    pastNeg: {},
    cboxWrapper: {},
  }),
);

interface ModalProps {
  subjectWord: string;
  postpositionWords: string[];
  keyPhrase?: string;
}

function ModalBox({ subjectWord, keyPhrase }: ModalProps) {
  const classes = useStyles();
  const [text, setText] = useState(keyPhrase ? keyPhrase : '');

  const onChange__keyPhrase = useCallback((e) => {
    setText(e.target.value);
  }, []);

  return (
    <Fragment>
      <div className="Modal--overlay" />
      <div className={classes.modalWrapper}>
        <div className={classes.modal}>
          <div className={classes.modalLine}>
            <div className={classes.subjectWord}>재능낭비</div>
            <div className={classes.postpositionWords}>
              <div className={classes.postpositionWord}>은/는</div>
              <div className={classes.postpositionWord}>으로</div>
              <div className={classes.postpositionWord}>에는</div>
            </div>
          </div>
          <div className={classes.modalLine}>
            <div className={classes.keyPhrase}>
              <input
                type="search"
                className={classes.search}
                value={text}
                onChange={onChange__keyPhrase}
              />
            </div>
          </div>
          <div className={classes.modalLine}>
            <div className={classes.postpositionWords}>
              <div className={classes.postpositionWord}>이다</div>
              <div className={classes.postpositionWord}>하다</div>
              <div className={classes.postpositionWord}>된다</div>
              <div className={classes.postpositionWord}>있다</div>
              <div className={classes.postpositionWord}>다</div>
              <div className={classes.pastNeg}>
                <div className={classes.cboxWrapper}>
                  <span>과거</span>
                </div>
                <div className={classes.cboxWrapper}>
                  <span>부정</span>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.modalLine}>
            <div>
              <button>취소</button>
            </div>
            <div>
              <button>확인</button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

ModalBox.defaultProps = {
  mark: '!',
};

export default ModalBox;
