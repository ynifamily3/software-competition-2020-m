import React, { createContext, Dispatch, useReducer, useContext } from 'react';
import LocalModelCN from '../libs/localmodel';

export interface Attr {
  pinfo: Info;
  prefix: string;
  content: string;
  postfix: string;
  id: string | number;
}

export interface Info {
  names: string[];
  attrs: Attr[];
  comment: string;
  parent: null | Info;
  childs: Info[];
  id: string | number;
  jsid: string | number;
}

export interface MyLocalModel {
  LocalModel: any;
  currentPath: string[];
  subjects: { name: string; id: number }[];
  info: Info | null; // 진입한 current info
}

const LocalModelContext = createContext<MyLocalModel | null>(null);

type Action =
  | {
      type: 'INIT';
      LocalModel: any;
    }
  | {
      type: 'CHANGE_PATH';
      path: string[];
    }
  | {
      type: 'CHANGE_SUBJECTS';
      subjects: { name: string; id: number }[];
    }
  | {
      type: 'CHANGE_INFO';
      info: any | Info; // any는 고육지책. 좀 더 조일 필요 있음.
    };

type LocalModelDispatch = Dispatch<Action>;

const LocalModelDispatchContext = createContext<LocalModelDispatch | null>(
  null,
);

function LocalModelReducer(state: MyLocalModel, action: Action): MyLocalModel {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        LocalModel: action.LocalModel,
      };
    case 'CHANGE_PATH':
      return {
        ...state,
        currentPath: action.path,
      };
    case 'CHANGE_SUBJECTS':
      return {
        ...state,
        subjects: action.subjects,
      };
    case 'CHANGE_INFO':
      return {
        ...state,
        info: action.info,
      };
    default:
      throw new Error('Unhandled action');
  }
}

const is_remote: boolean = false;
const LocalModel = new LocalModelCN(!is_remote);

////
declare global {
  interface Window {
    LocalModel: any;
  }
}
window.LocalModel = LocalModel; // 디버깅을 위해 window에 LocalModel 주입
////

export function MyLocalModelContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [localModel, dispatch] = useReducer(LocalModelReducer, {
    LocalModel: LocalModel,
    currentPath: [],
    subjects: [],
    info: null,
  });

  return (
    <LocalModelDispatchContext.Provider value={dispatch}>
      <LocalModelContext.Provider value={localModel}>
        {children}
      </LocalModelContext.Provider>
    </LocalModelDispatchContext.Provider>
  );
}

export function useMyLocalModel() {
  const state = useContext(LocalModelContext);
  if (!state) throw new Error('LocalModelProvider not found');
  return state;
}

export function useMyLocalModelDispatch() {
  const dispatch = useContext(LocalModelDispatchContext);
  if (!dispatch) throw new Error('LocalModelProvider not found');
  return dispatch;
}
