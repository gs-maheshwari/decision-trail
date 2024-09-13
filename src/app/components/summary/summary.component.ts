import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppState,
  Choice,
  Destination,
  DestinationFilters,
  Id,
  Question,
} from '../../models';
import {
  selectChoices,
  selectQuestions,
  selectDestinations,
} from '../../store/selectors';
import { reset, setFinalDestionation } from '../../store/actions';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  choices: Choice[] = [];
  questions: Question[] = [];
  destinations: Destination[] = [];
  finalDestination: Destination | undefined;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.select(selectChoices).subscribe((c) => (this.choices = c));
    this.store.select(selectQuestions).subscribe((q) => (this.questions = q));
    this.store.select(selectDestinations).subscribe((d) => {
      this.destinations = d;
      this.determineDestination();
    });
  }

  getQuestionText(questionId: Id): string {
    const question = this.questions.find((q) => q.id === questionId);
    return question ? question.question : 'Unknown Question';
  }

  getOptionText(choice: Choice): string {
    const question = this.questions.find((q) => q.id === choice.questionId);
    const option = question?.options.find(
      (o) => o.id === choice.selectedOptionId
    );
    return option ? option.text : 'Unknown Option';
  }

  determineDestination(): void {
    //let filters: DestinationFilters = {};

    // this.choices.forEach((choice) => {
    //   const question = this.questions.find((q) => q.id === choice.questionId);
    //   if (question) {
    //     const option = question.options.find(
    //       (o) => o.id === choice.selectedOptionId
    //     );
    //     if (option) {
    //       switch (question.id) {
    //         case this.questions[0].id:
    //           break;
    //         case 'B':
    //           filters.destination = option.text;
    //           break;
    //         case 'C':
    //           filters.budget = option.text;
    //           break;
    //         case 'D':
    //           filters.accommodation = option.text;
    //           break;
    //         default:
    //           break;
    //       }
    //     }
    //   }
    // });

    // this.finalDestination = this.destinations.find(
    //   (dest) =>
    //     dest.filters.destination === filters.destination &&
    //     dest.filters.budget === filters.budget &&
    //     dest.filters.accommodation === filters.accommodation
    // );

    const choiceMap = new Map(
      this.choices.map((choice) => [choice.questionId, choice.selectedOptionId])
    );

    this.finalDestination = this.destinations.find((destination) => {
      const filters = destination.filters;

      return (
        filters.destination === choiceMap.get('destination') &&
        filters.budget === choiceMap.get('budget') &&
        filters.accommodation === choiceMap.get('accommodation')
      );
    });

    if (this.finalDestination) {
      this.store.dispatch(
        setFinalDestionation({
          finalDestination: this.finalDestination,
        })
      );
    }
  }

  onRestart(): void {
    this.store.dispatch(reset());
    this.router.navigate(['/']);
  }
}
