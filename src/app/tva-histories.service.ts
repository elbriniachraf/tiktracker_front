import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TvaService {
  private apiUrl = 'http://localhost:8000/api/historique';

  constructor(private http: HttpClient) {}

  saveTva(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.apiUrl, data, { headers });
  }
}
