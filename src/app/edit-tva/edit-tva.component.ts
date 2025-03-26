import { Component, OnInit } from '@angular/core';
import { TvaService } from '../tva.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router'; // Importez RouterModule
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Ajoutez cette importation

interface Tva {
  country_code: string;
  label: string;
  rate: number;
  category: string;
  is_active: boolean;
  valid_from: Date;
  valid_to?: Date;
}

@Component({
  standalone: true,
  
  selector: 'app-tva-edit',
  templateUrl: './edit-tva.component.html',
  styleUrls: ['./edit-tva.component.css'],
  imports : [FormsModule, CommonModule],
})
export class EditTvaComponent  implements OnInit{
  newTva = {
    id: '',  // Ajoute l'id ici
    country_code: '',
    label: '',
    rate: 0,
    category: '',
    is_active: false,
    valid_from: '',
    valid_to: ''
  };

  constructor(private tvaService: TvaService) {}

  ngOnInit(): void {
    this.getTvaData();
  }

  getTvaData() {
    this.tvaService.getTvaRates().subscribe(
      (response) => {
        console.log('Réponse de l\'API:', response);
  
        if (Array.isArray(response.data)) {
          this.newTva = response.data[0];  
        
  
        } else {
          console.error('La réponse de l\'API ne contient pas de tableau dans "data"');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des données de TVA:', error);
      }
    );
  }
  

  // Méthode pour soumettre les modifications
  onSubmit(): void {
    if (this.newTva.id) {
      this.tvaService.updateTva(this.newTva.id, this.newTva).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'TVA mise à jour avec succès',
            text: 'La TVA a été mise à jour avec succès.',
            confirmButtonText: 'OK',
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur lors de la mise à jour de la TVA',
            text: 'Une erreur est survenue lors de la mise à jour de la TVA.',
            confirmButtonText: 'OK',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Aucune TVA ID disponible',
        text: 'Aucun ID de TVA trouvé pour cette mise à jour.',
        confirmButtonText: 'OK',
      });
    }
  }
  
  goBack() {
    window.history.back();
  }
  
}