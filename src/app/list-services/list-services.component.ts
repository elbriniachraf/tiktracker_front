import { Component, EventEmitter, Output } from '@angular/core';
import { ProductService } from '../product.service';
import { OnInit } from '@angular/core';
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
import { ServiceService } from '../service.service';
@Component({
  selector: 'app-list-services',
  standalone: true,
  imports: [NgxDatatableModule, HttpClientModule,CommonModule,FontAwesomeModule,GoogleMapsModule,FormsModule],

  templateUrl: './list-services.component.html',
  styleUrl: './list-services.component.css'
})
export class ListServicesComponent {
  @Output() productAjout = new EventEmitter<any>();
  services: any[] = [];  // Liste des produits
  pageSize: number = 10;  // Nombre de produits par page
  loading: boolean = true;  // Indicateur de chargement
  totalRecords: number = 0;  // Total des enregistrements
  selectedService: any = null;  // Service actuellement sélectionné
  constructor(private service: ServiceService) {}
  selectedDescription: string = '';
  isDrawerOpen: boolean = false;
  

  closeDrawer(): void {
    this.isDrawerOpen = false;
  }

  
  deleteProduct(id: number) {
    console.log(`Deleting product ${id}`);
  }
  
  changeStatus(id: number) {
    console.log(`Changing status of product ${id}`);
  }
  
  sendReport(id: number) {
    console.log(`Sending report for product ${id}`);
  }

  /**
   * Affiche la description dans un drawer.
   */
  showDescription(row: any): void {
    this.selectedDescription = row.description;
    this.isDrawerOpen = true;
  }
  ngOnInit(): void {
    this.loadProducts();
  }
  ajouterService(): void {
    this.productAjout.emit([]);
  }
  searchQuery=''

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredServices = this.services.slice(start, end);
    this.totalPages = Math.ceil(this.services.length / this.pageSize);
  }

  /**
   * Passe à la page suivante.
   */
  nextPage(): void {
    if (this.canNext()) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  /**
   * Revient à la page précédente.
   */
  previousPage(): void {
    if (this.canPrevious()) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  /**
   * Vérifie si on peut passer à la page suivante.
   */
  canNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  /**
   * Vérifie si on peut revenir à la page précédente.
   */
  canPrevious(): boolean {
    return this.currentPage > 1;
  }

  /**
   * Recherche un produit et met à jour la pagination.
   */
  onSearch(query: string): void {
    console.log("Recherche :", query);
    this.currentPage = 1;
  
    // Si la recherche est vide, on réinitialise les services filtrés
    if (!query.trim()) {
      this.filteredServices = [...this.services]; // Assurez-vous que 'this.services' contient la liste des services
    } else {
      // On filtre les services en fonction de la recherche
      this.filteredServices = this.services.filter(service =>
        (service.name && service.name.toLowerCase().includes(query.toLowerCase())) || // Recherche par nom
        (service.description && service.description.toLowerCase().includes(query.toLowerCase())) // Recherche par description
      );
    }
  
    console.log("Services filtrés :", this.filteredServices); // 🔹 Vérifier le résultat de la recherche
    this.totalPages = Math.ceil(this.filteredServices.length / this.pageSize);
  }
  
  filteredServices: any[] = []; // Produits filtrés (ex. par recherche)
  currentPage: number = 1; // Page actuelle
  totalPages: number = 0; // Nombre total de pages
  sorts: any[] = [{ prop: 'label', dir: 'asc' }]; // Critère de tri

  // Charger les produits depuis le service
  loadProducts(): void {
    this.service.getAllServices(1).subscribe(
      (response: { data: any[]; total: number; }) => {
        this.services = response.data;  // Données des produits
        this.totalRecords = response.total;  // Nombre total d'enregistrements
        this.loading = false;  // Fin du chargement
      },
      (error: any) => {
        console.error('Erreur lors du chargement des produits:', error);
        this.loading = false;
      }
    );
  }
  // Voir un service
  viewService(serviceId: number) {
    console.log(`Voir le service ID: ${serviceId}`);
  }

  // Modifier un service
  editService(serviceId: number) {
    console.log(`Modifier le service ID: ${serviceId}`);
  }

  deleteService(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteService(id).subscribe( // Utilisez 'this.service' ici
          () => {
            // Supprimer le service de la liste locale
            this.services = this.services.filter(service => service.id !== id);
            Swal.fire('Supprimé !', 'Le service a été supprimé.', 'success');
          },
          (error) => {
            console.error('Erreur lors de la suppression du service', error);
            Swal.fire('Erreur', 'Impossible de supprimer le service.', 'error');
          }
        );
      }
    });
  }
  
  // Changer le statut d'un service
  changeStatusService(serviceId: number) {
    console.log(`Changer le statut du service ID: ${serviceId}`);
  }

  // Envoyer un rapport pour un service
  sendReportService(serviceId: number) {
    console.log(`Envoyer un rapport pour le service ID: ${serviceId}`);
  }

  // Gestion du tri
  onSort(event: any): void {
    this.sorts = event.sorts;
    this.loadProducts();  // Recharger les produits avec le tri
  }

  // Voir le détail du produit
  viewProduct(productId: number): void {
    console.log('Voir le produit', productId);
  }

  // Éditer le produit
  editProduct(productId: number): void {
    console.log('Éditer le produit', productId);
  }
  
}
