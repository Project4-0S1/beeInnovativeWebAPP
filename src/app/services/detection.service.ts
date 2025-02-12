import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HornetDetection } from '../interfaces/HornetDetection';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DetectionService {
  private ApiUrl = `${environment.api_url}HornetDetections`

  constructor(private httpClient: HttpClient) { }

  getDetections(beehiveId?: number): Observable<HornetDetection[]> {
    return this.httpClient.get<HornetDetection[]>(this.ApiUrl + `?beehiveId=${beehiveId}`);
  }

  getHornetDetectionById(id: number): Observable<HornetDetection> {
    return this.httpClient.get<HornetDetection>(`${this.ApiUrl}/${id}`);
  }

  putDetection(id:number, detection: HornetDetection): Observable<HornetDetection> {
    return this.httpClient.put<HornetDetection>(this.ApiUrl + '/' + id, detection);
  }

  deleteDetection(id: number): Observable<HornetDetection> {
    return this.httpClient.delete<HornetDetection>(`${this.ApiUrl}/${id}`);
  }
}
