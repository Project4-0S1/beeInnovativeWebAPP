import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calculation } from '../interfaces/calculation';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  private ApiUrl = `${environment.api_url}calculations`

  constructor(private httpClient: HttpClient) { }

  postNewCalculation(calculation: Calculation): Observable<Calculation> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.post<Calculation>(`${this.ApiUrl}/`, calculation, { headers: headers });
  }
}
