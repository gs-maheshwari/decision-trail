import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, Question, Choice, Destination } from '../../models';
import { selectChoices, selectAppState } from '../../store/selectors';
import { Edge, Node } from '@swimlane/ngx-graph';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { CommonModule } from '@angular/common';
import { reset } from '../../store/actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-decision-tree',
  standalone: true,
  imports: [NgxGraphModule, CommonModule],
  templateUrl: './decision-tree.component.html',
  styleUrls: ['./decision-tree.component.css'],
})
export class DecisionTreeComponent implements OnInit {
  nodes: Node[] = [{ id: 'start', label: 'Start' }];
  links: Edge[] = [
    { id: 'yes', source: 'start', target: 'A1' },
    { id: 'no', source: 'start', target: 'A2' },
  ];
  choices: Choice[] = [];
  layoutSettings = {
    orientation: 'TB',
  };

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectAppState)
      .subscribe(({ questions, destinations, finalDestination }) => {
        this.buildGraph(questions, destinations, finalDestination);
        this.highlightPath();
      });

    this.store.select(selectChoices).subscribe((choices) => {
      this.choices = choices;
      this.highlightPath();
    });
  }

  buildGraph(
    questions: Question[],
    destinations: Destination[],
    finalDestination: Destination | undefined
  ): void {
    questions.forEach((question) => {
      question.options.forEach((option) => {
        this.nodes.push({
          id: option.id.toString(),
          label: option.text,
        });

        const targetQuestionId = option.nextChoiceId;
        const targetOptions =
          questions.find((q) => q.id === targetQuestionId)?.options || [];

        targetOptions.forEach((o) => {
          this.links.push({
            source: option.id.toString(),
            target: o.id.toString(),
            label: questions.find((q) => q.id === targetQuestionId)?.question,
          });
        });
      });
    });

    destinations.forEach((des) => {
      this.nodes.push({
        id: des.id.toString(),
        label: des.name,
        data: {
          class: finalDestination?.id === des.id ? 'highlighted' : '',
        },
      });
      this.links.push({
        source: des.filters.accommodation?.toString() || '',
        target: des.id.toString(),
      });
    });
  }

  highlightPath(): void {
    this.nodes = this.nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        class: this.choices.some((ch) => ch.selectedOptionId === node.id)
          ? 'highlighted'
          : node.data?.class,
      },
    }));
  }

  onRestart(): void {
    this.store.dispatch(reset());
    this.router.navigate(['/']);
  }
}
