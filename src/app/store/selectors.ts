import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../models';

export const selectAppState = createFeatureSelector<AppState>('questionnaire');

export const selectQuestions = createSelector(
  selectAppState,
  (state: AppState) => state.questions
);

export const selectDestinations = createSelector(
  selectAppState,
  (state: AppState) => state.destinations
);

export const selectCurrentQuestionId = createSelector(
  selectAppState,
  (state: AppState) => state.currentQuestionId
);

export const selectCurrentQuestion = createSelector(
  selectQuestions,
  selectCurrentQuestionId,
  (questions, currentId) => questions.find((q) => q.id === currentId)
);

export const selectChoices = createSelector(
  selectAppState,
  (state: AppState) => state.choices
);

export const selectIsFinished = createSelector(
  selectAppState,
  (state: AppState) => state.isFinished
);
