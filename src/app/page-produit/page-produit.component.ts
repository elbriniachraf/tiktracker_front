import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { faBox, faPlus, faCogs, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { ListProduitsComponent } from '../list-produits/list-produits.component';
import { ProductService } from '../product.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { HttpClientModule } from '@angular/common/http';
import { EditorModule } from '@tinymce/tinymce-angular';;
import { ToastrService } from 'ngx-toastr'
import { CategoryService } from '../category.service';
import { ListServicesComponent } from '../list-services/list-services.component';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-page-produit',
  standalone: true,
  imports: [FontAwesomeModule,CommonModule,ListProduitsComponent,ListServicesComponent, ReactiveFormsModule,HttpClientModule,FormsModule,EditorModule, HttpClientModule, AngularEditorModule],
  templateUrl: './page-produit.component.html',
  styleUrl: './page-produit.component.css',
  providers: [ProductService,CategoryService,ServiceService], // Service injecté


})
export class PageProduitComponent {
  selectedMenu: string = 'products'; // Valeur par défaut
  productForm!: FormGroup;
  htmlContent="";
  showForm: boolean = false;
    // Basculer l'affichage du formulaire
    toggleForm(): void {
      this.showForm = !this.showForm;
    }
    
  constructor(
    public router: Router,
    private location: Location,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
  ) { }
  categories:any = [ ];
  drawerOpen = false;
  newCategoryName = '';
  newCategoryDescription=""
  resetForm() {
    this.newCategoryName = '';
    this.newCategoryDescription = '';
  }
  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
  }

  private toastr: ToastrService | undefined;
 

  // Menu avec des éléments
  menuItems = [
    { label: 'Liste des Produits', icon: faBox, action: 'products' },
    { label: 'Ajouter un Produit', icon: faPlus, action: 'addProduct' },
    { label: 'Liste des Services', icon: faCogs, action: 'services' },
    { label: 'Ajouter un Service', icon: faPlus, action: 'addService' },
    { label: 'Statistiques', icon: faChartLine, action: 'statistics' }
  ];

  private initializeForm(): void {
    this.fetchCategories();
    this.productForm = this.fb.group({
      label: ['', [Validators.required]],
      reference: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required]],
      weight: [''],
      is_selling: [true],
      is_purchasing: [true],
      selling_price: ['', [Validators.required, Validators.min(0)]],
      length: [''],
      width: [''],
      height: [''],
      publicUrl: ['']
    });
  }



  onProductAjout(product: any) {
    this.selectedMenu = 'addProduct'; // Change d'onglet pour afficher le formulaire

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
  newCategory = { name: '', description: '' };

  deleteCategory(id: number) {
    if (id) {  // Vérifie que l'id n'est pas undefined
      this.categoryService.deleteCategory(id).subscribe(
        (response) => {
          console.log('Category deleted successfully:', response);
          // Actualise la liste des catégories ou fais d'autres actions nécessaires
        },
        (error) => {
          console.error('Erreur lors de la suppression de la catégorie:', error);
        }
      );
    } else {
      console.error('ID de la catégorie est undefined');
    }
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



  ngOnInit(): void {
    this.initializeForm();

 
  }
  goBack() {
    this.location.back();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.toastr?.error('Veuillez remplir correctement tous les champs obligatoires.', 'Erreur');
      return;
    }

    const productData = this.productForm.value;

    this.productService.addProduct(productData).subscribe({
      next: (response) => {
        this.toastr?.success('Produit ajouté avec succès !', 'Succès');
        this.productForm.reset(); // Réinitialiser le formulaire après ajout
        this.router.navigate(['/main/produits-services/produits']);
        this.selectedMenu="addProduct"
      },
      error: (error) => {
        this.toastr?.error('Une erreur est survenue lors de l\'ajout du produit.', 'Erreur');
        console.error('Erreur:', error);
      }
    });
  }


 
  // Méthode pour sélectionner un menu
  selectMenu(item: any) {
    this.selectedMenu = item.action;
    if (item.action === 'statistics') {
      this.router.navigate(['/statistics']); // Naviguer vers la page des statistiques
    }
  }
}
 