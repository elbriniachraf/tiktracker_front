import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Importer catchError pour gérer les erreurs

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://127.0.0.1:8000/api/categories'; // Remplacez par votre URL Laravel

  constructor(private http: HttpClient) {}

  // Fetch categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError) // Gestion des erreurs pour cette requête
    );
  }

  // Add a category
  addCategory(data: { name: string; description?: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      catchError(this.handleError) // Gestion des erreurs pour cette requête
    );
  }

  // Delete a category
  deleteCategory(id: string | number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete`, { id: id }).pipe(
      catchError(this.handleError) // Gestion des erreurs pour cette requête
    );
  }

  // Fonction pour gérer les erreurs
  private handleError(error: any): Observable<never> {
    console.error('Une erreur s\'est produite:', error);
    throw error; // Vous pouvez aussi utiliser un service de notification d'erreur pour afficher une alerte
  }
}
