import { Injectable } from '@angular/core';
import { EstimatedNestLocations } from '../interfaces/estimatedNestLocations';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EstimatedNestLocationService {

  private ApiUrl = `${environment.api_url}estimatednestlocations`
  
  constructor(private httpClient: HttpClient) { }

  getAllNests(): Observable<EstimatedNestLocations[]> {
    console.log(this.ApiUrl)
    return this.httpClient.get<EstimatedNestLocations[]>(this.ApiUrl);
  }

  getNestById(id: number): Observable<EstimatedNestLocations> {
    return this.httpClient.get<EstimatedNestLocations>(`${this.ApiUrl}/${id}`);
  }
}
