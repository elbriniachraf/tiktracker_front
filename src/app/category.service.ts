import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://127.0.0.1:8000/api/categories'; // Remplacez par votre URL Laravel

  constructor(private http: HttpClient) {}

  // Fetch categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add a category
  addCategory(data: { name: string; description?: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Delete a category
  deleteCategory(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete`, { id: id });

  }
}
