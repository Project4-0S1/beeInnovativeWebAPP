import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beehive } from './interfaces/beehive';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private ApiUrl= `${environment.api_url}beehives`

  constructor(private httpClient: HttpClient) {
  }

  getArticles(): Observable<Beehive[]> {
    return this.httpClient.get<Beehive[]>(this.ApiUrl);
  }

  getBeehiveById(id: number): Observable<Beehive> {
    return this.httpClient.get<Beehive>(`${this.ApiUrl}/${id}`);
  }
}
