import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TvaCalculatorService {

  private apiUrl = 'http://localhost:8000/api/tv-historique';  // Remplacez cette URL par celle de votre API

  constructor(private http: HttpClient) { }

  // Fonction pour calculer la TVA et enregistrer l'historique
}