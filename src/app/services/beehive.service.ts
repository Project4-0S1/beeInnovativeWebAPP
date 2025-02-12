import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Beehive } from '../interfaces/beehive';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  getBeehiveByIotId(id: string): Observable<Beehive> {
    return this.httpClient.get<Beehive>(`${this.ApiUrl}/iot/${id}`);
  }

  getFilteredBeehieves(filterByUserBeehives: boolean): Observable<Beehive[]> {
    let params = new HttpParams();

    // Add query parameters to the request
    if (filterByUserBeehives) {
      params = params.set('filterByUserBeehives', 'true');
    }

    return this.httpClient.get<Beehive[]>(this.ApiUrl, { params });
  }

  putCategory(id:number, beehive: Beehive): Observable<Beehive> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.put<Beehive>(`${this.ApiUrl}/${id}`, beehive, {headers: headers});
  }
}
