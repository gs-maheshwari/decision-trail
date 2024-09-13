import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, Question, Option } from '../../models';
import { selectCurrentQuestion, selectIsFinished } from '../../store/selectors';
import { makeChoice } from '../../store/actions';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css'],
})
export class QuestionnaireComponent implements OnInit {
  currentQuestion: Question | undefined;
  isFinished: boolean = false;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.select(selectCurrentQuestion).subscribe((question) => {
      this.currentQuestion = question;
    });

    this.store.select(selectIsFinished).subscribe((finished) => {
      this.isFinished = finished;
      if (finished) {
        this.router.navigate(['/summary']);
      }
    });
  }

  onSelectOption(option: Option): void {
    this.store.dispatch(
      makeChoice({
        questionId: this.currentQuestion!.id,
        optionId: option.id,
        nextChoiceId: option.nextChoiceId,
      })
    );
  }
}
