import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const EventSource: any = window['EventSource'];

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private telemetryUrl = 'http://localhost:3000/api/telemetry';
  private serviceUrl = 'http://localhost:3000/api/service/';

  constructor(private http: HttpClient, private zone: NgZone) { }

  getAllDevices(): Observable<any> {
    return this.http.get(this.serviceUrl+ 'device');
  }

  getDeviceTwin(id): Observable<any> {
    return this.http.get(this.serviceUrl + 'device/' + id);
  }

  getAllTelemetry() :Observable<any> {
    return this.http.get(this.telemetryUrl);
  }

  setDesiredState(id, type, value, unit): Observable<any> {
    return this.http.put(this.serviceUrl + 'device/' + id + '/DesiredState/thresholds/' + type,{value: value, unit: unit})
  }
  
}
