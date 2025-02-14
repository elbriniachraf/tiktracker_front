import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private apiUrl = 'http://127.0.0.1:8000/api/events'; // Remplacez par l'URL réelle de votre API

  constructor(private http: HttpClient) {}

  // Récupérer tous les événements
  getEvents(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Ajouter un nouvel événement
  addEvent(event: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, event);
  }

  // Mettre à jour un événement existant
  updateEvent(eventId: number, event: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${eventId}`, event);
  }

  // Supprimer un événement
  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${eventId}`);
  }
}
