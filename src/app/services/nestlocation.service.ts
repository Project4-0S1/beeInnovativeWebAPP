import { Injectable } from '@angular/core';
import { Nestlocations } from '../interfaces/nestlocations';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NestlocationService {

  private ApiUrl = `${environment.api_url}nestlocations`
  
  private beehives: Nestlocations[] = [];

  constructor(private httpClient: HttpClient) { }

  getAllNests(): Observable<Nestlocations[]> {
    console.log(this.ApiUrl)
    return this.httpClient.get<Nestlocations[]>(this.ApiUrl);
  }

  getNestById(id: number): Observable<Nestlocations> {
    return this.httpClient.get<Nestlocations>(`${this.ApiUrl}/${id}`);
  }

  putStatus(id:number, nestlocation: Nestlocations): Observable<Nestlocations> {
    delete nestlocation.status;
    
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.put<Nestlocations>(`${this.ApiUrl}/${id}`, nestlocation, {headers: headers});
  }
}
