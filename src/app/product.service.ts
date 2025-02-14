import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/api/products'; // URL de votre API Laravel

  constructor(private http: HttpClient) {}

  // Récupérer la liste des produits avec pagination
  getProducts(page: number = 1, pageSize: number = 10, productType?: string, query?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (productType) {
      params = params.set('product_type', productType); // Filtre par type de produit
    }

    if (query) {
      params = params.set('query', query); // Filtre par recherche
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  // Supprimer un produit
  deleteProduct(productId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete`, { id: productId });
  }

  // Ajouter un produit
  addProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product); // Envoie une requête POST pour ajouter un produit
  }
}
