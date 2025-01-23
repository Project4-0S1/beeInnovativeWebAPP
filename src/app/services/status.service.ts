import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Status } from '../interfaces/status';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private ApiUrl = `${environment.api_url}Status`
    
  private ub: Status[] = [];

  constructor(private httpClient: HttpClient) { }

  getAllStatuses(): Observable<Status[]> {
    return this.httpClient.get<Status[]>(this.ApiUrl);
  }

  
}
