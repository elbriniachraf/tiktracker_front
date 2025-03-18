import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private apiUrl = 'http://127.0.0.1:8000/api/factures'; // Remplace par l'URL réelle de ton API

  constructor(private http: HttpClient) { }

  // Créer une facture
  createFacture(factureData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, factureData);
  }


  private apiUrl2 = 'https://api.currencylayer.com/live';
  private apiKey = '5572aea68ab35627b32d9e8783baa525'; // Remplace par ta vraie clé



  getExchangeRates(base: string = 'MAD'): Observable<any> {
    const url = `${this.apiUrl2}?access_key=${this.apiKey}&source=`+base;
    return this.http.get(url);
  }
  // Récupérer toutes les factures
  getAllFactures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Récupérer une facture par ID
  getFactureById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour une facture
  updateFacture(id: string, factureData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, factureData);
  }

  // Supprimer une facture
  deleteFacture(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
