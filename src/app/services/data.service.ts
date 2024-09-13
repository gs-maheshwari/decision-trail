import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionnaireData } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private jsonUrl = 'assets/questionnaire.json';

  constructor(private http: HttpClient) {}

  getQuestionnaire(): Observable<QuestionnaireData> {
    return this.http.get<QuestionnaireData>(this.jsonUrl);
  }
}
