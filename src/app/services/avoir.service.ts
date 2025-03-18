import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvoirService {
  private apiUrl = 'http://127.0.0.1:8000/api/avoirs'; // Remplace par ton URL API

  constructor(private http: HttpClient) {}

  // Récupérer tous les avoirs
  getAvoirs(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Créer un nouvel avoir
  createAvoir(avoirData: any): Observable<any> {
    return this.http.post(this.apiUrl, avoirData);
  }

  // Récupérer un avoir par ID
  getAvoirById(avoirId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${avoirId}`);
  }
}
