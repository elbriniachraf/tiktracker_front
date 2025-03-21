import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/api/products'; 


  constructor(private http: HttpClient) {}

  // ✅ Récupérer la liste des produits avec pagination et filtres
  getProducts(page: number = 1, pageSize: number = 10, productType?: string, query?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (productType) {
      params = params.set('product_type', productType);
    }

    if (query && query.trim() !== '') { 
      params = params.set('query', query);
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des produits:', error);
        return throwError(() => new Error('Échec de la récupération des produits.'));
      })
    );
  }

  // ✅ Ajouter un produit
  addProduct(product: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.apiUrl, product, { headers }).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'ajout du produit:', error);
        return throwError(() => new Error('Échec de l\'ajout du produit.'));
      })
    );
  }

  // ✅ Supprimer un produit
  deleteProduct(productId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete`, { id: productId }).pipe(
      catchError(error => {
        console.error('Erreur lors de la suppression du produit:', error);
        return throwError(() => new Error('Échec de la suppression du produit.'));
      })
    );
  }

  // ✅ Récupérer un produit par ID
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
}
