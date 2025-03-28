import { Component, OnInit } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ClientService } from '../client.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';
import { faUsers, faTruck, faUserPlus, faAddressBook } from '@fortawesome/free-solid-svg-icons';


import { GoogleMapsModule } from "@angular/google-maps";
import { FormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Router } from '@angular/router';
import { faTasks, faCalendarAlt, faSort } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [NgxDatatableModule, HttpClientModule,CommonModule,FontAwesomeModule,GoogleMapsModule,FormsModule],
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css'],
  providers: [ClientService], // Service injectéclie
})
export class GestionComponent implements OnInit {
  rows: any[] = []; // Tableau des clients récupérés
  faUsers = faUsers;
  faTruck = faTruck;
  faUserPlus = faUserPlus;
  faAddressBook = faAddressBook;
  faTasks = faTasks;
  faCalendarAlt = faCalendarAlt;
  faSort = faSort;
ville="";
adresse="";
codePostal="";


nom: string = '';
prenom: string = '';
email: string = '';
telephone: string = '';

pays: string = '';
numSiret: string = '';
numSiren: string = '';
iban: string = '';
profileImage: string | ArrayBuffer | null = null;
onAddressChange(event: any) {
  console.log('Address:');
}
  
public autoCompleteConfig = {
  types: [],
  componentRestrictions: { country: 'us' }, // Change 'us' to your desired country code
};
  columns = [
    { name: 'Identifiant', prop: 'identifiant',cellClass:'green-cell' },
    { name: 'Nom', prop: 'nom' },
    { name: 'Prénom', prop: 'prenom' },
    { name: 'Email', prop: 'email', width: 270 },
    { name: 'Téléphone', prop: 'telephone', width: 200 },
    { name: 'Adresse', prop: 'adresse', width: 320 },
    { name: 'Code Postal', prop: 'code_postal' },
    { name: 'Ville', prop: 'ville' },
    { name: 'Pays', prop: 'pays', width: 210 },
    { name: 'Numéro SIRET', prop: 'num_siret' },
    { name: 'Code APE', prop: 'code_ape' },
    { name: 'IBAN', prop: 'iban' },
    { name: 'BIC', prop: 'bic' },
    { name: 'Type', prop: 'type' },
  ];

  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: { lat: -31, lng: 147 },
    zoom: 4,
  };

  generatedIdentifiant: string = '';

  // Fonction pour générer un identifiant
  generateIdentifiant(): void {
    if (this.nom && this.prenom) {
      const prenomFirstLetter = this.prenom.charAt(0).toLowerCase();
      const nomLower = this.nom.toLowerCase();
      this.generatedIdentifiant = `${prenomFirstLetter}${nomLower}`;
    } else {
      this.generatedIdentifiant = '';
    }
  }

  addClient(): void {
    const client = {
      nom: this.nom,
      prenom: this.prenom,
      email:(document.getElementById('email') as HTMLInputElement).value,
      telephone: this.telephone,
       adresse : (document.getElementById('adresse') as HTMLInputElement).value,
      code_postal: (document.getElementById('code_postal') as HTMLInputElement).value,
      ville: (document.getElementById('ville') as HTMLInputElement).value,
      pays: this.pays,
      num_siret: this.numSiret,
      code_ape: this.numSiren,
      iban: this.iban,
      type:"particulier",
      profileImage: this.profileImage
    };

    this.clientService.addClient(client).subscribe({
      next: (response) => {
        console.log('Client ajouté avec succès :', response);
        alert('Client ajouté avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du client :', error);
        alert('Une erreur s\'est produite lors de l\'ajout du client.');
      }
    });
  }

  // Méthode pour changer l'image de profil
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string; // Assigner l'image sélectionnée à l'avatar
      };
      reader.readAsDataURL(file); // Lire l'image comme une URL de données
    }
  }

  isDrawerOpen = false;
  latitude: number = 48.8566; // Exemple : Paris
  longitude: number = 2.3522; // Exemple : Paris
  zoom: number = 12; // Niveau de zoom par défaut

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  // Variables pour la pagination
  totalRecords: number = 0; // Nombre total d'enregistrements
  pageSize: number = 12; // Nombre d'enregistrements par page
  currentPage: number = 1; // Page actuelle
  pages: number[] = []; // Pages visibles
  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 }; // Position du menu
  selectedRow: any = null; // Ligne sélectionnée


  constructor(private clientService: ClientService,private router: Router) {}
  getRowClass(row: any, index: number): string {
    // Retourne une classe différente selon l'indice de la ligne
    return index % 2 === 0 ? 'datatable-row-even' : 'datatable-row-odd';
  }
  onRightClick(event: MouseEvent, row: any): void {
    event.preventDefault(); // Empêche le menu contextuel par défaut
    this.selectedRow = row; // Stocke la ligne sélectionnée
    this.contextMenuPosition = { x: event.clientX, y: event.clientY }; // Positionne le menu
    this.showContextMenu = true; // Affiche le menu
  }

  editRow(row: any): void {
    console.log('Modifier', row);
    this.closeContextMenu();
  }

  // Supprimer une ligne

  deleteRow(): void {
    this.showContextMenu = false; // Affiche le menu

    if (this.selectedRow) {
      // Afficher la fenêtre de confirmation avec SweetAlert
      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Voulez-vous vraiment supprimer ce client ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // Si confirmé, envoyer la requête de suppression
          this.clientService.deleteClient(this.selectedRow._id).subscribe({
            next: (response) => {
              // Suppression réussie, retirer la ligne localement
              this.rows = this.rows.filter((r) => r !== this.selectedRow);
              
              // Afficher un toast de succès avec SweetAlert
              Swal.fire({
                icon: 'success',
                title: 'Client supprimé',
                text: 'Le client a été supprimé avec succès.',
                timer: 3000,
                toast:true,
                position: 'top-end',
                showConfirmButton: false
              });

            },
            error: (error) => {
              // Si une erreur se produit lors de la suppression
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors de la suppression du client.',
                timer: 3000,
                showConfirmButton: false
              });
            }
          });
        } else {
          console.log('Suppression annulée');
        }
      });
    } else {
      console.log('Aucune ligne sélectionnée');
    }
  }
  rawEvent: any;
  loading=true;
  contextmenuRow: any;
  contextmenuColumn: any;
  typeFilter  = '';
  query  = '';

  
  onTableContextMenu(contextMenuEvent:any) {
    console.log(contextMenuEvent);

    const x = contextMenuEvent.event.clientX; // Coordonnée X
    const y = contextMenuEvent.event.clientY; // Coordonnée Y
    this.contextMenuPosition = { x: x, y: y }; // Positionne le menu
  
    this.rawEvent = contextMenuEvent.event;
    if (contextMenuEvent.type === 'body') {
      this.contextmenuRow = contextMenuEvent.content;
      this.contextmenuColumn = undefined;
    } else {
      this.contextmenuColumn = contextMenuEvent.content;
      this.contextmenuRow = undefined;
    }
    this.selectedRow =    this.contextmenuRow ; // Stocke la ligne sélectionnée
    this.showContextMenu = true; // Affiche le menu

    contextMenuEvent.event.preventDefault();
    contextMenuEvent.event.stopPropagation();
  }
  // Ferme le menu contextuel
  closeContextMenu(): void {
    this.showContextMenu = false;
  }
  
  ngOnInit(): void {
    setTimeout(() => {
      this.loadClients();
        
      }, 1200);
  }
  navigateTo(path: string): void {
    this.router.navigate([path]).then((success) => {
      if (success) {
        console.log('Navigation réussie vers', path);
      } else {
        console.error('Erreur lors de la navigation vers', path);
      }
    });
  }
  // Charger les clients
  loadClients(): void {
    this.loading = true; 
 
    
    this.clientService.getClients(this.currentPage, this.pageSize,this.typeFilter,this.query).subscribe(
      (response) => {
        this.rows = response.data; // Données des clients
        this.totalRecords = response.total; // Nombre total d'enregistrements
        this.updatePages(); // Mettre à jour les pages visibles

        setTimeout(() => {
          
          this.loading = false; 
        },   1200 
      );
      },
      (error) => {
        console.error('Erreur lors de la récupération des clients:', error);
      }
    );
  }

  // Gérer le changement de page
  changePage(page: number): void {
    if (page < 1 || page > Math.ceil(this.totalRecords / this.pageSize)) {
      return; // Empêcher les pages invalides
    }
    this.currentPage = page;
    this.loadClients();
  }

  // Calculer les pages visibles
  updatePages(): void {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    const maxVisiblePages = 4;
    const pages: number[] = [];

    const startPage = Math.max(
      1,
      Math.min(this.currentPage - 2, totalPages - maxVisiblePages + 1)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    this.pages = pages;
  }
}
