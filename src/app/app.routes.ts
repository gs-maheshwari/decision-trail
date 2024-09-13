import { Routes } from '@angular/router';
import {
  SummaryComponent,
  DecisionTreeComponent,
  QuestionnaireComponent,
} from './components';

export const routes: Routes = [
  { path: '', component: QuestionnaireComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'decision-tree', component: DecisionTreeComponent },
];
