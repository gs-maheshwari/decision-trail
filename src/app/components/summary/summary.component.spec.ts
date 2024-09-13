import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SummaryComponent } from './summary.component';
import { AppState, Choice, Destination, Question } from '../../models';
import {
  selectChoices,
  selectQuestions,
  selectDestinations,
} from '../../store/selectors';
import { reset } from '../../store/actions';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let store: MockStore<AppState>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  const initialState: AppState = {
    choices: [],
    questions: [],
    destinations: [],
    currentQuestionId: 'A',
    isFinished: false,
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SummaryComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: (key: string) => 'someValue' },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    store.overrideSelector(selectChoices, [
      { questionId: 'B', selectedOptionId: '1' } as Choice,
    ]);
    store.overrideSelector(selectQuestions, [
      {
        id: 'B',
        question: 'Select the type of destination?',
        options: [
          { id: '1', text: 'Beach', nextChoiceId: 'C' },
          { id: '2', text: 'Mountain', nextChoiceId: 'D' },
        ],
      } as Question,
    ]);
    store.overrideSelector(selectDestinations, [
      {
        id: 1,
        name: 'Tropical Island',
        filters: {
          destination: 'B1',
          budget: 'C3',
          accommodation: 'D2',
        },
      } as Destination,
    ]);

    spyOn(store, 'dispatch');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to selectChoices, selectQuestions, and selectDestinations', () => {
      component.ngOnInit();

      expect(component.choices.length).toBeGreaterThan(0);
      expect(component.questions.length).toBeGreaterThan(0);
      expect(component.destinations.length).toBeGreaterThan(0);
    });

    it('should call determineDestination after destinations are loaded', () => {
      spyOn(component, 'determineDestination');
      component.ngOnInit();
      expect(component.determineDestination).toHaveBeenCalled();
    });
  });

  describe('getQuestionText', () => {
    it('should return the correct question text for a valid question ID', () => {
      component.questions = [
        { id: 'B', question: 'Where do you want to go?', options: [] },
      ];
      const questionText = component.getQuestionText('B');
      expect(questionText).toBe('Where do you want to go?');
    });

    it('should return "Unknown Question" for an invalid question ID', () => {
      const questionText = component.getQuestionText('InvalidID');
      expect(questionText).toBe('Unknown Question');
    });
  });

  describe('getOptionText', () => {
    it('should return the correct option text for a valid choice', () => {
      component.questions = [
        {
          id: 'B',
          question: 'Where do you want to go?',
          options: [{ id: '1', text: 'Beach', nextChoiceId: 'C' }],
        },
      ];
      const choice: Choice = { questionId: 'B', selectedOptionId: '1' };
      const optionText = component.getOptionText(choice);
      expect(optionText).toBe('Beach');
    });

    it('should return "Unknown Option" for an invalid choice', () => {
      const choice: Choice = {
        questionId: 'InvalidID',
        selectedOptionId: 'InvalidOption',
      };
      const optionText = component.getOptionText(choice);
      expect(optionText).toBe('Unknown Option');
    });
  });

  describe('determineDestination', () => {
    it('should set the finalDestination based on choices and filters', () => {
      component.questions = [
        {
          id: 'destination',
          question: 'Select the type of destination?',
          options: [{ id: "1", text: 'Beach', nextChoiceId: 'budget' }],
        },
        {
          id: 'budget',
          question: 'What is your budget range?',
          options: [{ id: "1", text: 'High', nextChoiceId: 'accommodation' }],
        },
        {
          id: 'accommodation',
          question: 'Select the type of accommodation?',
          options: [{ id: "1", text: 'Resort', nextChoiceId: null }],
        },
      ];
      component.choices = [
        { questionId: 'destination', selectedOptionId: "1" },
        { questionId: 'budget', selectedOptionId: "1" },
        { questionId: 'accommodation', selectedOptionId: "1" },
      ];
      component.destinations = [
        {
          id: 1,
          name: 'Tropical Island',
          filters: {
            destination: "1",
            budget: "1",
            accommodation: "1",
          },
        },
      ];
      component.determineDestination();
      expect(component.finalDestination?.name).toBe('Tropical Island');
    });

    it('should not set finalDestination if no match is found', () => {
      component.choices = [{ questionId: 'B', selectedOptionId: '1' }];
      component.questions = [
        {
          id: 'B',
          question: 'Where do you want to go?',
          options: [{ id: '1', text: 'Beach', nextChoiceId: 'C' }],
        },
      ];
      component.destinations = [
        {
          id: 2,
          name: 'Mountain Escape',
          filters: {
            destination: 'B2',
            budget: 'C1',
            accommodation: 'D4',
          },
        },
      ];
      component.determineDestination();
      expect(component.finalDestination).toBeUndefined();
    });
  });

  describe('onRestart', () => {
    it('should dispatch reset action and navigate to "/"', () => {
      component.onRestart();
      expect(store.dispatch).toHaveBeenCalledWith(reset());
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
