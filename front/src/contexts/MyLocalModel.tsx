import React, { createContext, Dispatch, useReducer, useContext } from 'react';

export interface MyLocalModel {
  test: string;
  counter: number;
}

const LocalModelContext = createContext<MyLocalModel | null>(null);

type Action =
  | {
      type: 'CREATE';
      text: string;
    }
  | {
      type: 'TOGGLE';
      id: number;
    }
  | {
      type: 'REMOVE';
      id: number;
    };

type LocalModelDispatch = Dispatch<Action>;

const LocalModelDispatchContext = createContext<LocalModelDispatch | null>(
  null,
);

function LocalModelReducer(state: MyLocalModel, action: Action): MyLocalModel {
  switch (action.type) {
    case 'CREATE':
      return {
        test: 'good create',
        counter: state.counter + 1,
      };
    case 'TOGGLE':
      return {
        ...state,
        test: 'good toggle',
      };
    case 'REMOVE':
      return {
        test: 'good remove',
        counter: state.counter - 1,
      };
    default:
      throw new Error('Unhandled action');
  }
}

export function MyLocalModelContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [localModel, dispatch] = useReducer(LocalModelReducer, {
    test: 'hello!',
    counter: 0,
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
