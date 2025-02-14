import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'http://127.0.0.1:8000/api/clients'; // URL de votre API Laravel

  constructor(private http: HttpClient) {}

  // Récupérer la liste des clients avec pagination
  getClients(page: number = 1, pageSize: number = 10, type?: string, query?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString()); // Laravel utilise `per_page` par défaut pour la taille
  
    if (type) {
      params = params.set('type', type);
    }
  
    if (query) {
      params = params.set('query', query);
    }
  
    return this.http.get<any>(this.apiUrl, { params });
  }
  
  deleteClient(clientId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete`, { id: clientId });
  }

  

  addClient(client: any): Observable<any> {
    return this.http.post(this.apiUrl, client); // Envoie une requête POST pour ajouter un client
  }
}
