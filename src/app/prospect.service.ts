import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProspectService {
  private apiUrl = 'http://127.0.0.1:8000/api/prospects'; // URL de votre API Laravel

  constructor(private http: HttpClient) {}

  /**
   * Récupérer la liste des prospects avec pagination, filtres et recherche.
   * 
   * @param page - Numéro de la page.
   * @param pageSize - Taille de la page.
   * @param etat - État du prospect (facultatif).
   * @param query - Recherche par mot-clé (facultatif).
   * @returns Observable avec les résultats paginés.
   */
  getProspects(
    page: number = 1,
    pageSize: number = 10,
    etat?: string,
    query?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (etat) {
      params = params.set('etat', etat);
    }

    if (query) {
      params = params.set('query', query);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * Ajouter un prospect.
   * 
   * @param prospect - Les données du prospect à ajouter.
   * @returns Observable avec la réponse de l'API.
   */
  addProspect(prospect: any): Observable<any> {
    return this.http.post(this.apiUrl, prospect);
  }

  /**
   * Supprimer un prospect par ID.
   * 
   * @param prospectId - L'ID du prospect à supprimer.
   * @returns Observable avec la réponse de l'API.
   */
  deleteProspect(prospectId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete`, { id: prospectId });
  }
}
