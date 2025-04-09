import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../category.service';
import { ServiceService } from '../service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  providers: [CategoryService, ServiceService]
})
export class AddServiceComponent implements OnInit {
  serviceForm!: FormGroup;
  showModal = false; // Contrôle l'affichage de la modal

  categories = [
    { id: 1, name: 'Catégorie 1' },
    { id: 2, name: 'Catégorie 2' },
    { id: 3, name: 'Catégorie 3' }
  ];
  departments = [
    { id: 1, name: 'Département 1' },
    { id: 2, name: 'Département 2' },
    { id: 3, name: 'Département 3' }
  ];
  // categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private serviceService: ServiceService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchCategories();
  }

  private initializeForm(): void {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      private: [false],
      duration: ['', Validators.required],
      status: ['active', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      service_provider: ['', [Validators.required, Validators.maxLength(255)]],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      features: [''],
      image_url: [''],
      is_featured: [false],
      tags: ['']
    });
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

  onSubmit(): void {
    if (this.serviceForm.invalid) {
      this.markFormGroupTouched(this.serviceForm);
      alert('Veuillez remplir correctement tous les champs.');
      return;
    }

    // Prepare the form data
    const formData = {
      ...this.serviceForm.value,
      start_date: this.formatDateTime(this.serviceForm.value.start_date),
      end_date: this.formatDateTime(this.serviceForm.value.end_date),
      features: this.parseTextAreaToArray(this.serviceForm.value.features),
      tags: this.parseTextAreaToArray(this.serviceForm.value.tags)
    };

    this.serviceService.addService(formData)
      .pipe(
        catchError(this.handleError)
      )
      .subscribe(
        (response) => {
          alert('Service ajouté avec succès !');
          this.serviceForm.reset();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du service', error);
          alert('Une erreur est survenue lors de l\'ajout du service. Veuillez vérifier vos données.');
        }
      );
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Error handler
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('Client-side error:', error.error.message);
    } else {
      // Backend returned unsuccessful response code
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`
      );
    }
    // Return an observable with a user-facing error message
    return throwError('Something went wrong; please try again later.');
  }

  // Helper method to format date for backend
  private formatDateTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  // Helper method to parse textarea input to array
  private parseTextAreaToArray(input: string): string[] {
    if (!input) return [];
    return input.split(',').map(item => item.trim()).filter(item => item);
  }
  initForm() {
    this.serviceForm = this.fb.group({
      referenceService: [null],
      serviceName: [null],
      unite: [null],
      duree: [null],
      categorie: [null],
      fournisseur: [null],
      prix: [null],
      tva: [null],
      statut: [null],
      description: [null]
    });
  }



}