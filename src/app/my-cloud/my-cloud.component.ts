import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { FileService } from '../file.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-my-cloud',
  templateUrl: './my-cloud.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule, FontAwesomeModule, MatProgressBarModule, MatListModule],
  styleUrls: ['./my-cloud.component.css'],
  providers: [FileService], // Service injecté

})
export class MyCloudComponent implements OnInit {
  currentSection: string = 'cloud'; // Section actuelle
  files: any[] = []; // Contenu des fichiers
  filteredFiles: any[] = []; // Liste des fichiers filtrés
  uploadInProgress = false; 
  downloadInProgress = false;
  isDragging = false; // Gestion du drag-and-drop
  dragTimeout: any;

  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };

  onRightClick(event: MouseEvent): void {
    event.preventDefault(); // Empêche le menu contextuel par défaut
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.showContextMenu = true;
  }

  closeContextMenu(): void {
    this.showContextMenu = false;
  }

  addFolder(): void {
    console.log('Ajouter un dossier');
    this.createFolder();
    this.closeContextMenu();
  }

  refresh(): void {
    console.log('Actualiser');
    this.closeContextMenu();
  }

  uploadFilee(): void {
    console.log('Téléverser un fichier');
    this.closeContextMenu();
    
  }
  statistics = {
    totalSpace: 10, // 10 GB par utilisateur
    usedSpace: 0, // L'espace utilisé sera calculé dynamiquement
    categories: [
      { name: 'Images', percentage: 0, color: 'green', icon: 'image', count: 0 },
      { name: 'Documents', percentage: 0, color: 'yellow', icon: 'file', count: 0 },
      { name: 'PDFs', percentage: 0, color: 'red', icon: 'file-pdf', count: 0 },
      { name: 'Vidéos', percentage: 0, color: 'blue', icon: 'file-video', count: 0 },
    ],

  }

  getUsedSpacePercentage(): number {
    return (this.statistics.usedSpace / this.statistics.totalSpace) * 100;
  }


  calculateStatistics(): void {
    let usedSpace = 0; // Espace utilisé par les fichiers téléchargés
    const categoryCounts: { [key: string]: number } = {  // Utilisation d'un index de type string
      Images: 0,
      Documents: 0,
      PDFs: 0,
      Vidéos: 0
    };
    this.files.forEach(file => {
      usedSpace += file.size / (1024 * 1024 * 1024); // Convertir la taille du fichier en GB

      // Mise à jour des catégories
      const extension = file.name.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'jpg':
        case 'png':
        case 'jpeg':
          categoryCounts['Images']++;
          break;
        case 'pdf':
          categoryCounts['PDFs']++;
          break;
        case 'doc':
        case 'docx':
        case 'txt':
          categoryCounts['Documents']++;
          break;
        case 'mp4':
        case 'avi':
        case 'mkv':
          categoryCounts['Vidéos']++;
          break;
        default:
          break;
      }
    });

    this.statistics.usedSpace = usedSpace;

    // Calculer les pourcentages par catégorie
    this.statistics.categories.forEach(category => {
      category.count = categoryCounts[category.name];
      category.percentage = (category.count / this.files.length) * 100; // Pourcentage des fichiers dans cette catégorie
    });
  }
  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.loadFiles();
  }


  /**
   * Changer la section active.
   */
  changeSection(section: string): void {
    this.currentSection = section;
    this.filterFiles();
  }

  getFileIcon(extension: string): string {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return 'pdf.jpg'; // Vous pouvez remplacer par l'icône appropriée (ex: Font Awesome)
      case 'doc':
      case 'docx':
        return 'word.jpg'; // Icône Word
      case 'xls':
      case 'xlsx':
        return 'excel.jpg'; // Icône Excel
      case 'zip':
        return 'zip.jpg'; // Icône ZIP
      case 'rar':
        return 'rar.jpg'; // Icône RAR
      case 'png':
      case 'jpg':
      case 'jpeg':
        case 'txt':
        return 'file.jpg'; // Icône Image
      case 'mp4':
      case 'avi':
      case 'mkv':
        return 'file-video'; // Icône Vidéo
      case 'Folder':
        case 'folder':
        case null:
         
            return 'folder.jpg'; // Icône Vidéo
      default:
        return 'file.jpg'; // Icône par défaut
    }
  }
  selectedFileForRename: any = null;
isRenameModalVisible: boolean = false;
  
  showRenameModal(file: any): void {
    this.selectedFileForRename = file; // Stocker le fichier sélectionné pour le renommage
    this.isRenameModalVisible = true; // Afficher la modal
  }


  toggleFavorite(file: any, event: MouseEvent): void {
    event.stopPropagation(); // Empêche de déclencher l'événement click de la carte
    file.is_favorite = !file.is_favorite; // Toggle l'état de favori
  
    // Optionnel : Envoyer la mise à jour au backend
    this.fileService.toggleFavorite(file._id, file.is_favorite).subscribe(
      (response: any) => {
        console.log('Favori mis à jour avec succès', response);
      },
      (error: any) => {
        console.error('Erreur lors de la mise à jour du favori', error);
        file.isFavorite = !file.isFavorite; // Revenir à l'état précédent si erreur
      }
    );
  }
  

  // Appliquer le filtre selon la section active
  filterFiles(): void {
    if (this.currentSection === 'favorites') {
      // Filtrer les fichiers favoris
      this.filteredFiles = this.files.filter(file => file.is_favorite);
    } else if (this.currentSection === 'trash') {
      // Filtrer les fichiers dans la corbeille
      this.filteredFiles = this.files.filter(file => file.isTrashed);
    } else {
      // Afficher tous les fichiers pour la section 'cloud'
      this.filteredFiles = this.files;
    }
  }
  renameFile(): void {
    // Appeler l'API ou mettre à jour le fichier dans votre logique
    console.log(`Renommage du fichier : ${this.selectedFileForRename.name}`);
    
    // Effectuer la logique de mise à jour ici
    // Exemple d'appel API pour renommer le fichier
    this.fileService.renameFile(this.selectedFileForRename._id, this.selectedFileForRename.name)
      .subscribe({
        next: (response: any) => {
          console.log('Fichier renommé avec succès', response);
          this.isRenameModalVisible = false; // Fermer la modal après succès
        },
        error: (error: any) => {
          console.error('Erreur lors du renommage', error);
        }
      });
  }
  
  closeRenameModal(): void {
    this.isRenameModalVisible = false; // Fermer la modal
  }
  
  viewFile(fileId: string): void {
    const fileUrl = `http://127.0.0.1:8000/${fileId}`; // Remplacer par l'URL de votre route dans Laravel

    // Ouvrir le fichier dans un nouvel onglet
    window.open(fileUrl, '_blank');
  }
  selectFile(selectedFile: any): void {
    // Désélectionner tous les autres fichiers
    this.files.forEach(file => {
      if (file !== selectedFile) {
        file.selected = false;
      }
    });

    // Sélectionner ou désélectionner le fichier actuel
    selectedFile.selected = !selectedFile.selected;
  }
  downloadFile(file: any): void {
    console.log("Télécharger le fichier:", file);
    this.fileService.downloadFile(file._id).subscribe(
      (response: any) => {
        // Logic pour gérer la réponse, tel que l'ouverture du fichier ou le déclenchement du téléchargement
        const link = document.createElement('a');
        link.href = response.fileUrl; // Assurez-vous que l'API renvoie l'URL correcte pour le téléchargement
        link.download = file.name; // Définir le nom du fichier téléchargé
        link.click();
      },
      (error: any) => {
        console.error('Erreur lors du téléchargement du fichier :', error);
      }
    );
  }
  
  shareFile(file: any): void {
    console.log("Partager le fichier:", file);
    // Logic to share the file
  }


  /**
   * Gestion du drag-and-drop.
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!this.isDragging) {
      this.isDragging = true;
    }
    clearTimeout(this.dragTimeout);
  }

  onDragLeave(): void {
    this.dragTimeout = setTimeout(() => {
      this.isDragging = false;
    }, 100); // Petit délai pour éviter les flashs
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  /**
   * Sélectionner des fichiers depuis un input.
   */
  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  /**
   * Uploader des fichiers.
   */
  handleFiles(files: FileList): void {
    Array.from(files).forEach((file) => {
      this.uploadFile(file);
    });
  }

  loadFiles(): void {
    this.fileService.getFiles().subscribe(
      (response: any) => {
        this.files = response.files; // Assurez-vous que votre API renvoie un tableau sous `files`
        this.filteredFiles = response.files; // Assurez-vous que votre API renvoie un tableau sous `files`
        
        this.calculateStatistics();
      },
      (error: any) => {
        console.error('Erreur lors du chargement des fichiers :', error);
      }
    );
  }

  createFolder() {
    const folderName = 'Nouveau Dossier';
    const parentPath = 'parent/folder/path'; // Facultatif, peut être null

    this.fileService.addFolder(folderName, parentPath).subscribe(
      (response) => {
        console.log('Dossier créé avec succès :', response);
      },
      (error) => {
        console.error('Erreur lors de la création du dossier :', error);
      }
    );
  }

  uploadFile(file: File): void {
    this.uploadInProgress = true;
    this.fileService.uploadFile(file).subscribe(
      (response: any) => {
        console.log('Fichier uploadé avec succès :', response);
        this.loadFiles();
        this.uploadInProgress = false;
      },
      (error: any) => {
        console.error('Erreur lors de l\'upload du fichier :', error);
        this.uploadInProgress = false;
      }
    );
  }

  /**
   * Supprimer un fichier.
   */
  deleteFile(id: number): void {
    this.fileService.deleteFile(id).subscribe(
      (response:any) => {
        console.log('Fichier supprimé avec succès :', response);
        this.loadFiles();
      },
      (error:any) => {
        console.error('Erreur lors de la suppression du fichier :', error);
      }
    );
  }
}
