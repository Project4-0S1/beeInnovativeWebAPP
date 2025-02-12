import { Injectable } from '@angular/core';
import { User } from '@auth0/auth0-angular';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private ApiUrl = `${environment.api_url}users`

  constructor(private httpClient: HttpClient) { }

  getBeehiveByIotId(id: string): Observable<User> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get<User>(`${this.ApiUrl}/userSubTag/${id}`, {headers: headers});
  }
}
