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
import { CategoryService } from '../category.service';
import { GoogleMapsModule } from "@angular/google-maps";
import { FormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { routes } from '../app.routes';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  unit: string;
  status: string;
  category: string;
  provider: string;
  tva: string;
  rating?: number;
  start_date?: Date;
  end_date?: Date;
  image_url?: string;
  is_featured?: boolean;
  selected: boolean;
}
@Component({
  selector: 'app-list-services',
  standalone: true,
  imports: [NgxDatatableModule, HttpClientModule,CommonModule,FontAwesomeModule,GoogleMapsModule,FormsModule],

  templateUrl: './list-services.component.html',
  styleUrl: './list-services.component.css'
})
export class ListServicesComponent {

  @Output() productAjout = new EventEmitter<any>();
  categories: any[] = [];
  services: any[] = [];  // Liste des produits
  pageSize: number = 10;  // Nombre de produits par page
  loading: boolean = true;  // Indicateur de chargement
  totalRecords: number = 0;  // Total des enregistrements
  // selectedService: any = null;  // Service actuellement sélectionné
  constructor(private service: ServiceService, private router: Router,  
  ) {}
  drawerOpen3: boolean = false;  // Variable pour contrôler l'ouverture/fermeture du drawer

  selectedDescription: string = '';
  isDrawerOpen: boolean = false;
  isDrawerOpen2: boolean = false; 
  isAddingService = false;
   isDrawerOpenEdit: boolean = false;
   selectedService: any = { // Initialisation avec un objet vide
    name: '',
    description: '',
    price: 0,
    duration: 0,
    category_name: '',
    status: 'active',
    start_date: '',
    end_date: ''
  };
  
  closeDrawer(): void {
    this.isDrawerOpen = false;
  }
 
  closeDrawer2() {
    this.isDrawerOpen2 = false;  // Ferme le drawer2
    this.selectedService = null;  // Réinitialise selectedService pour éviter de garder des données obsolètes
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
  // showDescription(row: any): void {
  //   this.selectedDescription = row.description;
  //   this.isDrawerOpen = true;
  //   this.isDrawerOpen2 = true;  // Ouvrir le second drawer


  // }
  // showDescription(row: any): void {
  //   this.selectedDescription = row.description;
  //   this.selectedService = row; // Mettre à jour selectedService avec le service sélectionné
  //   this.isDrawerOpen = true;
  //   this.isDrawerOpen2 = true;  // Ouvrir le second drawer
  // }
  showDescription(row: any): void {
    this.selectedDescription = row.description;
    this.selectedService = row; // Mettre à jour selectedService avec les données du service sélectionné
    
    // Assurer que selectedService est correctement peuplé avant d'ouvrir les drawers
    if (this.selectedService) {
        this.isDrawerOpen = true; // Ouvre le premier drawer (description)
        this.isDrawerOpen2 = false; // Ouvre le second drawer (service)
    }
}
viewService(serviceId: number): void {
  // Rechercher le service par son ID
  const service = this.services.find(s => s.id === serviceId);
  
  if (service) {
    // Enregistrer le service sélectionné
    this.selectedService = service;
    
    // Ouvrir uniquement le drawer des détails (drawer2)
    this.isDrawerOpen2 = true;
    
    // Fermer le drawer de description pour éviter la confusion
    this.isDrawerOpen = false;
    
    console.log('Détails du service affichés:', service);
  } else {
    console.error(`Service avec ID ${serviceId} non trouvé.`);
    // Optionnellement, afficher un message d'erreur à l'utilisateur
  }
}
  ngOnInit(): void {
    this.loadProducts();
    this.loadServices();


  }
  ajouterService() {
    this.isAddingService = true; // Active l'affichage du formulaire
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
  
  // Voir un service
// viewService(serviceId: number) {
//   this.isDrawerOpen2 = true;  // Ouvrir le drawer

//   const service = this.services.find(s => s.id === serviceId);
//   if (service) {
//     console.log('Détails du service:', service);  // Affiche tous les champs du service
//     // Vous pouvez aussi utiliser ces informations pour remplir un modal ou un autre composant d'affichage
//   } else {
//     console.log(`Service avec ID ${serviceId} non trouvé.`);
//   }
// }





  // Modifier un service
  // editService(serviceId: number) {
  //   console.log(`Modifier le service ID: ${serviceId}`);
  // }
 
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
 
navigateToAddService() {
  this.router.navigate(['/add-service']); // Change '/ajouter-service' selon ta route
}

navigateToEditService(id: string): void {
  // Naviguer vers la page d'édition avec l'ID du produit
  this.router.navigate(['/edit-service', id]);
}
  sortBy(column: string): void {
    // Implémentation du tri
    this.filteredServices.sort((a, b) => {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
      return 0;
    });
  }
  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.filteredServices.forEach(service => service.selected = isChecked);
  }
  loadServices(): void {
    this.loading = true;
    
    // Données du tableau de services
    const serviceData: Partial<Service>[] = [
      {
        id: '00015',
        name: 'Audit Comptable',
        description: 'Ce service propose un audit comptable complet pour analyser la santé financière de votre entreprise et identifier les opportunités d\'optimisation fiscale.',
        price: 450,
        duration: 8,
        unit: 'Heures',
        status: 'inactive',
        category: 'Comptables',
        provider: 'Cabinet Martin & Associés',
        rating: 4.8,
        start_date: new Date('2025-01-15'),
        end_date: new Date('2025-01-16'),
        is_featured: false
      },
      {
        id: '00014',
        name: 'Campagne Marketing Digital',
        description: 'Service de création et gestion de campagnes publicitaires sur les réseaux sociaux pour augmenter votre visibilité en ligne.',
        price: 350,
        duration: 5,
        unit: 'Jours',
        status: 'active',
        category: 'Publicité',
        provider: 'AgenceWeb Pro',
        rating: 4.5,
        start_date: new Date('2025-02-01'),
        end_date: new Date('2025-02-06'),
        is_featured: true
      },
      {
        id: '00013',
        name: 'Étude Technique',
        description: 'Analyse technique approfondie des systèmes existants et recommandations pour l\'amélioration des processus industriels.',
        price: 600,
        duration: 12,
        unit: 'Heures',
        status: 'inactive',
        category: 'Ingénierie',
        provider: 'TechSolutions Engineering',
        rating: 4.9,
        start_date: new Date('2025-03-10'),
        end_date: new Date('2025-03-12'),
        is_featured: false
      },
      {
        id: '00012',
        name: 'Développement Application Mobile',
        description: 'Conception et développement d\'une application mobile sur mesure pour iOS et Android, incluant le design UX/UI.',
        price: 1200,
        duration: 15,
        unit: 'Jours',
        status: 'inactive',
        category: 'Informatiques',
        provider: 'CodeMasters',
        rating: 4.7,
        start_date: new Date('2025-01-20'),
        end_date: new Date('2025-02-10'),
        is_featured: false
      },
      {
        id: '00011',
        name: 'Consultation Juridique',
        description: 'Consultation juridique avec un avocat spécialisé en droit des affaires pour résoudre vos problèmes légaux.',
        price: 180,
        duration: 2,
        unit: 'Jours',
        status: 'inactive',
        category: 'Juridiques',
        provider: 'Cabinet Légal Durand',
        rating: 4.6,
        start_date: new Date('2025-02-15'),
        end_date: new Date('2025-02-17'),
        is_featured: false
      },
      {
        id: '00010',
        name: 'Maintenance Serveurs',
        description: 'Service de maintenance et optimisation de serveurs pour garantir la performance et la sécurité de votre infrastructure informatique.',
        price: 280,
        duration: 4,
        unit: 'Jours',
        status: 'inactive',
        category: 'Informatiques',
        provider: 'IT Solutions Plus',
        rating: 4.3,
        start_date: new Date('2025-03-01'),
        end_date: new Date('2025-03-05'),
        is_featured: false
      },
      {
        id: '00009',
        name: 'Création Site Vitrine',
        description: 'Création d\'un site web vitrine moderne et responsive pour présenter votre entreprise et vos produits à vos clients.',
        price: 800,
        duration: 7,
        unit: 'Jours',
        status: 'active',
        category: 'Publicité',
        provider: 'WebDesign Expert',
        rating: 4.7,
        start_date: new Date('2025-02-05'),
        end_date: new Date('2025-02-12'),
        is_featured: true
      },
      {
        id: '00008',
        name: 'Vidéo Promotionnelle',
        description: 'Réalisation d\'une vidéo promotionnelle professionnelle incluant le tournage, le montage et la post-production.',
        price: 650,
        duration: 5,
        unit: 'Jours',
        status: 'active',
        category: 'Publicité',
        provider: 'Visual Media Productions',
        rating: 4.8,
        start_date: new Date('2025-03-15'),
        end_date: new Date('2025-03-20'),
        is_featured: true
      },
      {
        id: '00007',
        name: 'SEO & Référencement',
        description: 'Optimisation de votre site web pour les moteurs de recherche afin d\'améliorer votre positionnement et votre visibilité en ligne.',
        price: 400,
        duration: 8,
        unit: 'Jours',
        status: 'active',
        category: 'Publicité',
        provider: 'RankUp SEO',
        rating: 4.5,
        start_date: new Date('2025-01-25'),
        end_date: new Date('2025-02-02'),
        is_featured: true
      },
      {
        id: '00006',
        name: 'Formation E-commerce',
        description: 'Formation professionnelle sur les stratégies de vente en ligne, la gestion de boutique e-commerce et les techniques de conversion.',
        price: 320,
        duration: 3,
        unit: 'Jours',
        status: 'active',
        category: 'Publicité',
        provider: 'E-Commerce Academy',
        rating: 4.6,
        start_date: new Date('2025-04-01'),
        end_date: new Date('2025-04-04'),
        is_featured: true
      }
    ];

    // Conversion des données partielles en objets Service complets
    this.services = serviceData.map(data => ({
      ...data,
      tva: '0033225566',
      image_url: '/api/placeholder/80/80',
      selected: false
    } as Service));
    
    this.filteredServices = [...this.services];
    this.totalPages = Math.ceil(this.services.length / this.pageSize);
    this.loading = false;
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Logique pour charger les données de la page
    }
  }
}
