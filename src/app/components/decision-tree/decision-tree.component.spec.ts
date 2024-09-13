import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DecisionTreeComponent } from './decision-tree.component';
import { AppState, Question, Choice, Destination } from '../../models';
import { selectChoices, selectAppState } from '../../store/selectors';
import { reset } from '../../store/actions';
import { Router } from '@angular/router';

describe('DecisionTreeComponent', () => {
  let component: DecisionTreeComponent;
  let fixture: ComponentFixture<DecisionTreeComponent>;
  let store: MockStore<AppState>;
  let router: Router;

  const questions: Question[] = [
    {
      id: '1',
      question: 'Select the type of destination?',
      options: [
        { id: '1', text: 'Beach', nextChoiceId: '2' },
        { id: '2', text: 'Mountains', nextChoiceId: null },
      ],
    }
  ];

  const destinations: Destination[] = [
    {
      id: 1,
      name: 'Maldives - Tropical Beach Paradise',
      filters: {
        destination: 'B1',
        budget: 'C3',
        accommodation: 'D2',
      },
    },
  ];

  const mockChoices: Choice[] = [{ questionId: '1', selectedOptionId: '1' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        DecisionTreeComponent,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectAppState,
              value: { questions, destinations, finalDestionation: undefined },
            },
            { selector: selectChoices, value: mockChoices },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DecisionTreeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build the graph on ngOnInit', () => {
    spyOn(component, 'buildGraph').and.callThrough();

    component.ngOnInit();

    expect(component.buildGraph).toHaveBeenCalledWith(
      questions,
      destinations,
      undefined
    );
    expect(component.nodes.length).toBe(4);
    expect(component.links.length).toBe(3);
  });

  it('should dispatch reset and navigate on onRestart', () => {
    spyOn(store, 'dispatch');

    component.onRestart();

    expect(store.dispatch).toHaveBeenCalledWith(reset());
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
