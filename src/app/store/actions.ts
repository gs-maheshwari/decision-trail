import { createAction, props } from '@ngrx/store';
import { Destination, Id, QuestionnaireData } from '../models';

export const loadData = createAction(
  '[Questionnaire] Load Data',
  props<QuestionnaireData>()
);

export const makeChoice = createAction(
  '[Questionnaire] Make Choice',
  props<{ questionId: Id; optionId: Id; nextChoiceId: Id | null }>()
);

export const setFinalDestionation = createAction(
  '[Questionnaire] Final Destination',
  props<{ finalDestination: Destination }>()
);

export const reset = createAction('[Questionnaire] Reset');
