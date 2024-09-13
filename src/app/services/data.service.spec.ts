import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DataService } from './data.service';
import { QuestionnaireData } from '../models';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService],
    });

    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the questionnaire data', () => {
    service.getQuestionnaire().subscribe((data: QuestionnaireData) => {
      expect(data).toEqual(mockQuestionnaireData);
    });

    const req = httpMock.expectOne('assets/questionnaire.json');
    expect(req.request.method).toBe('GET');

    req.flush(mockQuestionnaireData);
  });

  it('should handle an error response', () => {
    service.getQuestionnaire().subscribe(
      () => fail('expected an error, not data'),
      (error) => expect(error.status).toBe(404)
    );

    const req = httpMock.expectOne('assets/questionnaire.json');
    req.flush('Error loading questionnaire', {
      status: 404,
      statusText: 'Not Found',
    });
  });
});
