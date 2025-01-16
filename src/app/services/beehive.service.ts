import { Injectable } from '@angular/core';
import { environment } from '../../environments/environmnent';
import { Beehive } from '../interfaces/beehive';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeehiveService {

  private ApiUrl = `${environment.api_url}beehives`

  private beehives: Beehive[] = [];

  constructor(private httpClient: HttpClient) { }

  getBeehives(): Observable<Beehive[]> {
    return this.httpClient.get<Beehive[]>(this.ApiUrl);
  }

  getBeehiveById(id: number): Observable<Beehive> {
    return this.httpClient.get<Beehive>(`${this.ApiUrl}/${id}`);
  }
}
