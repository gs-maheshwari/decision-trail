import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  DecisionTreeComponent,
  QuestionnaireComponent,
  SummaryComponent,
} from './components';
import { loadData } from './store/actions';
import { AppState } from './models';
import { Store } from '@ngrx/store';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    QuestionnaireComponent,
    SummaryComponent,
    DecisionTreeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'decision-trail';

  constructor(
    private store: Store<AppState>,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.getQuestionnaire().subscribe((questionnaire) => {
      this.store.dispatch(loadData(questionnaire));
    });
  }
}
