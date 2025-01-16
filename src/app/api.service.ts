import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beehive } from './beehive';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // baseurl = "https://beeinnovative20250114142339.azurewebsites.net/api/"
  baseurl = "https://localhost:7099/api/"

  constructor(private httpClient: HttpClient) {
  }

  getArticles(): Observable<Beehive[]> {
    return this.httpClient.get<Beehive[]>(this.baseurl + "beehives");
  }

  getBeehiveById(id: number): Observable<Beehive> {
    return this.httpClient.get<Beehive>(this.baseurl + "beehives/" + id);
  }
}
