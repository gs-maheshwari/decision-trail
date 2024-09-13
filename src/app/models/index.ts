export interface Option {
  id: Id;
  text: string;
  nextChoiceId: Id | null;
}

export interface Question {
  id: Id;
  question: string;
  options: Option[];
}

export interface DestinationFilters {
  destination?: string;
  budget?: string;
  accommodation?: string;
}

export interface Destination {
  id: number;
  name: string;
  filters: DestinationFilters;
}

export interface QuestionnaireData {
  questions: Question[];
  destinations: Destination[];
}

export interface AppState {
  questions: Question[];
  destinations: Destination[];
  currentQuestionId: Id | null;
  choices: Choice[];
  isFinished: boolean;
  finalDestination?: Destination;
}

export interface Choice {
  questionId: Id;
  selectedOptionId: Id;
}

export type Id = string | number;
