import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams ,HttpHeaders } from '@angular/common/http'; // Importer HttpParams et HttpClient
import { catchError, throwError } from 'rxjs'; // Importer catchError et throwError


@Injectable({
  providedIn: 'root',
})
export class TvaService {
  private apiUrl = 'http://127.0.0.1:8000/api/tva/rates';  // L'URL de votre API (directement définie ici)

  constructor(private http: HttpClient) { }  // Injection de HttpClient
  getTvaRates(): Observable<any> {
    return this.http.get<any>(this.apiUrl);  // Effectue une requête GET vers l'API
  }
  addTvaRate(tvaRate: any): Observable<any> {
    // Ajoutez des en-têtes pour spécifier le type de contenu
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Loguez les données avant l'envoi
    console.log('Données envoyées:', JSON.stringify(tvaRate));

    return this.http.post<any>(this.apiUrl, tvaRate, { headers }).pipe(
      catchError(error => {
        console.error('Détails complets de l\'erreur:', error);
        return throwError(error);
      })
    );
  }
  deleteTvaRate(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateTvaRate(tvaRate: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${tvaRate.id}`, tvaRate);
  }
 
  getTva(tvaId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rates/${tvaId}`);
  }
  
  updateTva(tvaId: string, tvaData: any): Observable<any> {
    // Construire correctement l'URL sans répéter "/rates"
    return this.http.put<any>(`${this.apiUrl}/${tvaId}`, tvaData);  // URL correcte
  }
  
  
  
}