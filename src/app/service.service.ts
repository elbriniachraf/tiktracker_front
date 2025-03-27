import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://127.0.0.1:8000/api/services';  // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  // Récupérer tous les services
  getAllServices(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}`);
  }
  
  // Ajouter un service
  addService(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }


  // Supprimer un service
  deleteService(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
  
}
