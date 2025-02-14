import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://127.0.0.1:8000/api/files'; // Remplacez par l'URL de votre API Laravel

  constructor(private http: HttpClient) {}

  /**
   * Obtenir la liste des fichiers.
   */
  getFiles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }


  downloadFile(fileId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/download/${fileId}`, {
      responseType: 'blob' // Indiquer que la réponse sera un fichier binaire (blob)
    });
  }
  

   /**
   * Ajouter un dossier.
   * @param folderName Nom du dossier
   * @param path Chemin du parent (optionnel)
   */
   addFolder(folderName: string, path: string | null = null): Observable<any> {
    const payload = {
      name: folderName,
      path: path || null, // Si aucun chemin n'est fourni, utiliser null
      is_folder: true // Toujours vrai pour un dossier
    };
    

    return this.http.post<any>(`${this.apiUrl}/add-folder`, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', // Le backend attend des données JSON
      }),
    });
  }

  renameFile(fileId: string, newName: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/rename/${fileId}`, { name: newName });
  }
  toggleFavorite(fileId: number, isFavorite: boolean): Observable<any> {
    const body = { isFavorite };
    return this.http.put<any>(`${this.apiUrl}/favorite/${fileId}`, body);
  }
    

  /**
   * Uploader un fichier.
   * @param file Fichier à uploader
   */
  uploadFile(file: File): Observable<any> {

    
    const formData = new FormData();

    // Obtenir les informations du fichier
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop(); // Extension du fichier
    const fileSize = file.size; // Taille du fichier en octets

    // Vérification basique si le fichier est un dossier
    // A ajuster selon votre logique
    const isFolder = file.type === 'directory';  // Cela dépend de la manière dont le navigateur gère les dossiers

    // Ajouter les informations au FormData
    formData.append('name', fileName);
    formData.append('extension', fileExtension || '');  // Extension vide si aucune
    formData.append('isFolder', isFolder ? 'true' : 'false'); // Dossier ou fichier
    formData.append('size', fileSize.toString());  // Taille du fichier en octets
    formData.append('file', file);  // Ajouter le fichier

    // Effectuer la requête HTTP pour uploader le fichier
    return this.http.post<any>(`${this.apiUrl}/upload`, formData, {
      headers: new HttpHeaders({
        // Vous pouvez ajouter des headers personnalisés si nécessaire
      })
    });
  }
  /**
   * Supprimer un fichier par ID.
   * @param id ID du fichier
   */
  deleteFile(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
