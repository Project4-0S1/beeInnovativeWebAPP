import { Injectable } from '@angular/core';
import { Nestlocations } from '../interfaces/nestlocations';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NestlocationService {

  private ApiUrl = `${environment.api_url}NestLocations`
  
  private beehives: Nestlocations[] = [];

  constructor(private httpClient: HttpClient) { }

  getAllNests(): Observable<Nestlocations[]> {
    return this.httpClient.get<Nestlocations[]>(this.ApiUrl);
  }

  getNestById(id: number): Observable<Nestlocations> {
    return this.httpClient.get<Nestlocations>(`${this.ApiUrl}/${id}`);
  }
}
