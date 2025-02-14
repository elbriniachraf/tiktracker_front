import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Devis } from '../../app/models/devise.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private _devisList: Devis[] = [];
  private devisSubject = new BehaviorSubject<Devis[]>(this._devisList);
  devis$ = this.devisSubject.asObservable();




  convertirEnFacture(id: number) {
    const devis = this._devisList.find(d => d.id === id);
    if (devis) devis.statut = 'Facturé';
    this.devisSubject.next(this._devisList);
  }

  
  private apiUrl = 'http://127.0.0.1:8000/api/devis';

  constructor(private http: HttpClient) {}

  ajouterDevis(nouveauDevis: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, nouveauDevis);
  }

  getDevis(client?: string): Observable<any> {
    let params = new HttpParams();
    if (client) {
      params = params.set('client', client); // Ajouter un filtre par client si nécessaire
    }

    return this.http.get<any>(this.apiUrl, { params });
  }


    // Met à jour un devis (changement de statut : Facturé, Annulé, etc.)
    mettreAJourDevis(id: string, data: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/${id}/update`, data);
    }
  
    // Envoi du devis par email
    envoyerDevisParMail(id: string): Observable<any> {
      return this.http.post(`${this.apiUrl}/${id}/envoyer-mail`, {});
    }
  
    // Récupération des détails d'un devis
    getDevisById(id: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/${id}`);
  
    }
}
