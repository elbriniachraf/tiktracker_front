import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { ProductService } from '../product.service';
import { CategoryService } from '../category.service';
import { ServiceService } from '../service.service';
@Component({
  selector: 'app-list-produits',
  standalone: true,
  imports: [NgxDatatableModule, HttpClientModule,CommonModule,FontAwesomeModule,GoogleMapsModule,FormsModule],

  templateUrl: './list-produits.component.html',
  styleUrl: './list-produits.component.css',
    providers: [ProductService,CategoryService,ServiceService], // Service injecté
  
})
export class ListProduitsComponent {
  @Output() productAjout = new EventEmitter<any>();
  products: any[] = [];  // Liste des produits
  pageSize: number = 10;  // Nombre de produits par page
  loading: boolean = true;  // Indicateur de chargement
  totalRecords: number = 0;  // Total des enregistrements
  constructor(private productService: ProductService,private router: Router,    private categoryService: CategoryService,) {}
  selectedDescription: string = '';
  isDrawerOpen: boolean = false;

  newCategory = { name: '', description: '' };
  categories:any = [ ];
  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe(
      () => {
        this.categories = this.categories.filter((cat:any) => cat._id !== id); // Mettez à jour la liste
      },
      (error) => {
        console.error('Erreur lors de la suppression de la catégorie', error);
      }
    );
  }
  addCategory(): void {
    this.newCategory={
      name: this.newCategoryName,
      description: this.newCategoryDescription
    }
    if (this.newCategoryName) {
      this.categoryService.addCategory(this.newCategory).subscribe(
        (data) => {
          this.categories.push(data); // Ajoutez directement la catégorie à la liste
          this.newCategory = { name: '', description: '' }; // Réinitialisez le formulaire
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la catégorie', error);
        }
      );
    }
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
  }


  drawerOpen = false;

  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
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
  newCategoryName = '';
  newCategoryDescription=""
  showDescription(row: any): void {
    this.selectedDescription = row.description;
    this.isDrawerOpen = true;
  }
  showForm: boolean = false;
  // Basculer l'affichage du formulaire
  toggleForm(): void {
    this.showForm = !this.showForm;
  }
  toggleForm2() {
    this.isFormOpen = !this.isFormOpen;
  }

  isDrawerOpen2 = false;
  tvaList = [
    { id: 1, nom: 'TVA Réduite', taux: 5.5 },
    { id: 2, nom: 'TVA Normale', taux: 20 }
  ];
  isFormOpen = false;
  newTva = { nom: '', taux: 0 };

  toggleDrawer2() {
    this.isDrawerOpen2 = !this.isDrawerOpen2;
  }

  addTva() {
    const newTva = { id: Date.now(), nom: 'Nouvelle TVA', taux: 10 };
    this.tvaList.push(newTva);
  }

  editTva(tva: any) {
  }

  deleteTva(id: number) {
    this.tvaList = this.tvaList.filter(tva => tva.id !== id);
  }
  resetForm() {
    this.newCategoryName = '';
    this.newCategoryDescription = '';
  }
  ngOnInit(): void {
    this.loadProducts();
  this.fetchCategories();

  }
  fetchCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des catégories', error);
      }
    );
  }
  ajouterProd(): void {
    this.productAjout.emit([]);
  }
  searchQuery=''

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredProducts = this.products.slice(start, end);
    this.totalPages = Math.ceil(this.products.length / this.pageSize);
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
    this.currentPage = 1;
    this.filteredProducts = this.products.filter(product =>
      product.label.toLowerCase().includes(query.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
  }
  filteredProducts: any[] = []; // Produits filtrés (ex. par recherche)
  currentPage: number = 1; // Page actuelle
  totalPages: number = 0; // Nombre total de pages
  sorts: any[] = [{ prop: 'label', dir: 'asc' }]; // Critère de tri

  // Charger les produits depuis le service
  loadProducts(): void {
    this.productService.getProducts(1).subscribe(
      (response: { data: any[]; total: number; }) => {
        this.products = response.data;  // Données des produits
        this.totalRecords = response.total;  // Nombre total d'enregistrements
        this.loading = false;  // Fin du chargement
      },
      (error: any) => {
        console.error('Erreur lors du chargement des produits:', error);
        this.loading = false;
      }
    );
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
