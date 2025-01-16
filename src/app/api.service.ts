import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beehive } from './interfaces/beehive';
import { environment } from '../environments/environmnent';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // baseurl = "https://beeinnovative20250114142339.azurewebsites.net/api/"
  baseurl = "https://localhost:7099/api/"

  private ApiUrl= `${environment.api_url}beehives`

  constructor(private httpClient: HttpClient) {
  }

  getArticles(): Observable<Beehive[]> {
<<<<<<< HEAD
    return this.httpClient.get<Beehive[]>(this.ApiUrl);
  }

  getBeehiveById(id: number): Observable<Beehive> {
    return this.httpClient.get<Beehive>(`${this.ApiUrl}/${id}`);
=======
    return this.httpClient.get<Beehive[]>(this.baseurl + "beehives");
  }

  getBeehiveById(id: number): Observable<Beehive> {
    return this.httpClient.get<Beehive>(this.baseurl + "beehives/" + id);
>>>>>>> 57ab992fa1f3e9403dcdbec8acb293ab5601429d
  }
}
