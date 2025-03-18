import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RelanceService {
  private apiUrl = 'http://127.0.0.1:8000/api/relances'; // Remplace par ton URL API

  constructor(private http: HttpClient) {}

  // Récupérer toutes les relances
  getRelances(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Créer une nouvelle relance
  createRelance(relanceData: any): Observable<any> {
    return this.http.post(this.apiUrl, relanceData);
  }

  // Récupérer une relance par ID
  getRelanceById(relanceId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${relanceId}`);
  }
}
