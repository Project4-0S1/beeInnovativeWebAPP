import { Injectable } from '@angular/core';
import { Beehive } from './beehive'

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeehiveService {
  constructor(private httpClient: HttpClient) {
  }
  
  getBeehives(): Observable<Beehive[]> {
    return this.httpClient.get<Beehive[]>("https://localhost:7099/api/beehives");
  }
  
  getBeehiveById(id: number): Observable<Beehive> {
    return this.httpClient.get<Beehive>("https://localhost:7099/api/beehives/" + id);
  }
}
