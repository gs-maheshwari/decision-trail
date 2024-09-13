import { createReducer, on, Action } from '@ngrx/store';
import { loadData, makeChoice, reset, setFinalDestionation } from './actions';
import { AppState } from '../models';

export const initialState: AppState = {
  questions: [],
  destinations: [],
  currentQuestionId: 'A',
  choices: [],
  isFinished: false,
  finalDestination: undefined,
};

const appReducer = createReducer(
  initialState,
  on(loadData, (state, { questions, destinations }) => ({
    ...state,
    questions,
    destinations,
    currentQuestionId: questions.length > 0 ? questions[0].id : null,
  })),
  on(makeChoice, (state, { questionId, optionId, nextChoiceId }) => ({
    ...state,
    choices: [...state.choices, { questionId, selectedOptionId: optionId }],
    currentQuestionId:
      nextChoiceId !== null ? nextChoiceId : state.currentQuestionId,
    isFinished: nextChoiceId === null,
  })),
  on(setFinalDestionation, (state, { finalDestination }) => ({
    ...state,
    finalDestination,
  })),
  on(reset, (state) => ({
    ...state,
    choices: initialState.choices,
    currentQuestionId: initialState.currentQuestionId,
    isFinished: initialState.isFinished,
  }))
);

export function reducer(state: AppState | undefined, action: Action) {
  return appReducer(state, action);
}
