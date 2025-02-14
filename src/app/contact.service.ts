import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://127.0.0.1:8000/api/contacts'; // URL de votre API Laravel

  constructor(private http: HttpClient) {}

  /**
   * Récupérer la liste des contacts avec pagination, filtres et recherche.
   * 
   * @param page - Numéro de la page.
   * @param pageSize - Taille de la page.
   * @param query - Recherche par mot-clé (facultatif).
   * @returns Observable avec les résultats paginés.
   */
  getContacts(
    page: number = 1,
    pageSize: number = 10,
    type?: string, 
    
    query?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (query) {
      params = params.set('query', query);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * Ajouter un contact.
   * 
   * @param contact - Les données du contact à ajouter.
   * @returns Observable avec la réponse de l'API.
   */
  addContact(contact: any): Observable<any> {
    return this.http.post(this.apiUrl, contact);
  }

  /**
   * Supprimer un contact par ID.
   * 
   * @param contactId - L'ID du contact à supprimer.
   * @returns Observable avec la réponse de l'API.
   */
  deleteContact(contactId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete`, { id: contactId });
  }

  /**
   * Mettre à jour un contact.
   * 
   * @param contactId - L'ID du contact à mettre à jour.
   * @param contactData - Les données mises à jour du contact.
   * @returns Observable avec la réponse de l'API.
   */
  updateContact(contactId: string, contactData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${contactId}`, contactData);
  }
}
