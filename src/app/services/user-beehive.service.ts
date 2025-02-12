import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserBeehive } from '../interfaces/user-beehive';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserBeehiveService {

  private ApiUrl = `${environment.api_url}UserBeehives`
  
    private ub: UserBeehive[] = [];
  
    constructor(private httpClient: HttpClient) { }
  
    getAll(): Observable<UserBeehive[]> {
      return this.httpClient.get<UserBeehive[]>(this.ApiUrl);
    }
  
    getById(id: number): Observable<UserBeehive> {
      return this.httpClient.get<UserBeehive>(`${this.ApiUrl}/${id}`);
    }

    postNewUserConnection(ub: UserBeehive): Observable<UserBeehive> {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      return this.httpClient.post<UserBeehive>(`${this.ApiUrl}`, ub, { headers: headers });
    }

    deleteUserBeehiveConnection(id: number):Observable<UserBeehive> {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      return this.httpClient.delete<UserBeehive>(`${this.ApiUrl}/${id}`, {headers: headers});
    }
}
