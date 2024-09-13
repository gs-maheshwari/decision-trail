import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { QuestionnaireComponent } from './questionnaire.component';
import { makeChoice } from '../../store/actions';
import { AppState, Question, Option } from '../../models';
import { selectCurrentQuestion, selectIsFinished } from '../../store/selectors';

describe('QuestionnaireComponent', () => {
  let component: QuestionnaireComponent;
  let fixture: ComponentFixture<QuestionnaireComponent>;
  let store: MockStore<AppState>;
  let router: jasmine.SpyObj<Router>;

  const initialState = {
    currentQuestion: { id: 1, text: 'Question?', options: [] },
    isFinished: false,
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [QuestionnaireComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionnaireComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    spyOn(store, 'dispatch');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to selectCurrentQuestion and assign currentQuestion', () => {
      const mockQuestion: Question = {
        id: 1,
        question: 'Question?',
        options: [],
      };
      store.overrideSelector(selectCurrentQuestion, mockQuestion);
      store.overrideSelector(selectIsFinished, false);

      component.ngOnInit();

      expect(component.currentQuestion).toEqual(mockQuestion);
    });

    it('should subscribe to selectIsFinished and navigate if finished', () => {
      store.overrideSelector(selectIsFinished, true);
      const mockQuestion: Question = {
        id: 1,
        question: 'Question?',
        options: [],
      };
      store.overrideSelector(selectCurrentQuestion, mockQuestion);

      component.ngOnInit();

      expect(component.isFinished).toBeTrue();
      expect(router.navigate).toHaveBeenCalledWith(['/summary']);
    });

    it('should not navigate if not finished', () => {
      store.overrideSelector(selectIsFinished, true);
      const mockQuestion: Question = {
        id: 1,
        question: 'Question?',
        options: [],
      };
      store.overrideSelector(selectCurrentQuestion, mockQuestion);
      store.overrideSelector(selectIsFinished, false);

      component.ngOnInit();

      expect(component.isFinished).toBeFalse();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('onSelectOption', () => {
    it('should dispatch makeChoice action with correct payload', () => {
      const mockOption: Option = { id: 1, text: 'Option 1', nextChoiceId: 2 };
      const mockQuestion: Question = {
        id: 1,
        question: 'Question?',
        options: [mockOption],
      };
      component.currentQuestion = mockQuestion;

      component.onSelectOption(mockOption);

      expect(store.dispatch).toHaveBeenCalledWith(
        makeChoice({
          questionId: mockQuestion.id,
          optionId: mockOption.id,
          nextChoiceId: mockOption.nextChoiceId,
        })
      );
    });
  });
});
