import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import {
  DecisionTreeComponent,
  QuestionnaireComponent,
  SummaryComponent,
} from './components';
import { DataService } from './services/data.service';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { loadData } from './store/actions';
import { of } from 'rxjs';
import { AppState, QuestionnaireData } from './models';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: MockStore<AppState>;
  let dataService: jasmine.SpyObj<DataService>;

  const mockQuestionnaireData: QuestionnaireData = {
    questions: [
      {
        id: '1',
        question: 'What is your favorite color?',
        options: [
          { id: '1', text: 'Red', nextChoiceId: '2' },
          { id: '2', text: 'Blue', nextChoiceId: '3' },
        ],
      },
    ],
    destinations: [],
  };

  beforeEach(async () => {
    const dataServiceSpy = jasmine.createSpyObj('DataService', [
      'getQuestionnaire',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        RouterOutlet,
        QuestionnaireComponent,
        SummaryComponent,
        DecisionTreeComponent,
        StoreModule.forRoot({}),
      ],
      providers: [
        provideMockStore(),
        { provide: DataService, useValue: dataServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;

    dataService.getQuestionnaire.and.returnValue(of(mockQuestionnaireData));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadData with the correct payload on ngOnInit', () => {
    const action = loadData(mockQuestionnaireData);

    spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
