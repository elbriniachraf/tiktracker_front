import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { RouterModule , Router} from '@angular/router'; 

import { TvaService } from '../tva.service';
import Swal from 'sweetalert2';

interface TvaRate {
  id: number;             
  country_code: string;
  label: string;
  rate: number;
  category: string;
  is_active: boolean;
  valid_from: Date;
  valid_to?: Date;
}

@Component({
  selector: 'app-tva-rate-list',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule, 
    NgxDatatableModule, 
    FontAwesomeModule, 
    FormsModule,
    RouterModule
    
  ],
  templateUrl: './tva-rate-list.component.html',
  styleUrl: './tva-rate-list.component.css'
})
export class TvaRateListComponent implements OnInit {
  filteredTvaRates: TvaRate[] = [];
  tvaRates: TvaRate[] = [];
  searchQuery = '';
  sorts = [];
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;
  loading: boolean = false; 
  tvas: any[] = [];
  isDrawerOpen = false;
  newTva: any = {
    country_code: '',
    label: '',
    rate: null as number | null, // Le taux peut être un nombre ou null
    category: '',
    valid_from: null as Date | null, 
    valid_to: null as Date | null,   
    is_active: true,
    
  };;

  constructor(private tvaService: TvaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchTvaRates();
  }

  fetchTvaRates() {
    this.loading = true;
    this.tvaService.getTvaRates().subscribe(
      (response: any) => {
        console.log('Réponse API:', response);
        this.tvaRates = response.data ?? [];
        this.filteredTvaRates = this.tvaRates;
        this.totalPages = Math.ceil(this.filteredTvaRates.length / this.pageSize);
        this.loading = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération des taux de TVA', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de récupérer les taux de TVA'
        });
      }
    );
  }

  showAddTvaForm() {
    this.isDrawerOpen = true;
    this.newTva = {
      country_code: '',
      label: '',
      rate: 0,
      category: '',
      is_active: true,
      valid_from: new Date(),
     
    };
  }

  closeDrawer() {
    this.isDrawerOpen = false;
  }

  addTva() {
    // Validation de base
    if (!this.validateTvaForm()) {
      return;
    }

    // Préparez les données avec des conversions de type si nécessaire
    const dataToSend = {
      country_code: this.newTva.country_code,
      label: this.newTva.label,
      rate: Number(this.newTva.rate),
      category: this.newTva.category,
      valid_from: this.formatDate(this.newTva.valid_from),
      valid_to: this.newTva.valid_to ? this.formatDate(this.newTva.valid_to) : null,
      is_active: this.newTva.is_active
    };

    console.log('Données formatées:', dataToSend);

    this.loading = true;
    this.tvaService.addTvaRate(dataToSend).subscribe(
      (response: any) => {
        console.log('Réponse complète du serveur:', response);

        // Afficher un message de succès
        Swal.fire({
          icon: 'success',
          title: 'TVA ajoutée avec succès',
          text: `Le taux de TVA ${this.newTva.label} a été ajouté.`
        });

        // Fermer la drawer
        this.closeDrawer();

        // Mettre à jour la table avec la nouvelle TVA (ajoutez la nouvelle TVA dans votre tableau)
        this.tvas.push(response.data);  // Vous devrez adapter ceci selon la structure exacte de votre réponse

        // Réinitialiser le formulaire
        this.newTva = {
          country_code: '',
          label: '',
          rate: null,
          category: '',
          valid_from: null,
          valid_to: null,
          is_active: true
        };

        // Arrêter le chargement
        this.loading = false;
      },
      (error) => {
        console.error('Erreur détaillée:', error);

        // Récupérez les détails de l'erreur de validation côté serveur
        if (error.error && error.error.errors) {
          const validationErrors = error.error.errors;
          Swal.fire({
            icon: 'error',
            title: 'Erreurs de validation',
            html: Object.keys(validationErrors).map(key =>
              `<p>${key}: ${validationErrors[key].join(', ')}</p>`
            ).join('')
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error.message || 'Impossible d\'ajouter le taux de TVA'
          });
        }

        this.loading = false;
      }
    );
  }

  
  
  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; 
  }

  validateTvaForm(): boolean {
    if (!this.newTva.country_code || !this.newTva.label || 
        !this.newTva.rate || !this.newTva.category || 
        !this.newTva.valid_from) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs requis',
        text: 'Veuillez remplir tous les champs obligatoires'
      });
      return false;
    }
    return true;
  }

  onSearch(query: string) {
    this.filteredTvaRates = this.tvaRates.filter(rate =>
      rate.country_code.toLowerCase().includes(query.toLowerCase()) ||
      rate.label.toLowerCase().includes(query.toLowerCase())
    );
  }

  onSort(event: any) {
    const sortField = event.sorts[0]?.prop as keyof TvaRate;
    const sortOrder = event.sorts[0]?.dir;

    this.filteredTvaRates = [...this.filteredTvaRates].sort((a, b) => {
      const fieldA = a[sortField] as string | number;
      const fieldB = b[sortField] as string | number;

      if (sortOrder === 'desc') {
        return fieldB > fieldA ? 1 : -1;
      } else {
        return fieldA > fieldB ? 1 : -1;
      }
    });
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  editTva(row: any) {
    console.log('Éditer la TVA:', row);
  }

  deleteTva(row: TvaRate) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir supprimer cette TVA ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true  
    }).then((result) => {
      if (result.isConfirmed) {
        this.tvaService.deleteTvaRate(row.id).subscribe(
          () => {
            this.filteredTvaRates = this.filteredTvaRates.filter(tva => tva.id !== row.id);
            console.log('TVA supprimée:', row);
  
            Swal.fire({
              title: 'Succès',
              text: 'La TVA a été supprimée avec succès!',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          },
          (error) => {
            console.error('Erreur lors de la suppression de la TVA:', error);
  
            Swal.fire({
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la suppression de la TVA.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    });
  }
  
  navigateToEditTva(tvaId: number) {
    this.router.navigate(['/edit-tva', tvaId]);
  }
  goBack() {
    window.history.back();
  }
  
  
}