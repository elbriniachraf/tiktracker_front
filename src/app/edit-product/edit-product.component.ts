import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    FontAwesomeModule, 
    CommonModule, 
    ReactiveFormsModule,  
    EditorModule // Si tu utilises l'éditeur dans le template
  ],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {
  productForm!: FormGroup;
  productId!: number;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    // Récupère l'ID du produit à partir de l'URL
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadProduct();
  }

  // Initialisation du formulaire avec des valeurs par défaut
  initializeForm(): void {
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
      publicUrl: [''],
    });
  }

  // Charger les données du produit et pré-remplir le formulaire
  loadProduct(): void {
    this.productService.getProductById(this.productId.toString()).subscribe(
      (product) => {
        this.productForm.patchValue({
          label: product.label,
          reference: product.reference,
          description: product.description,
          price: product.price,
          category: product.category,
          weight: product.weight,
          is_selling: product.is_selling,
          is_purchasing: product.is_purchasing,
          selling_price: product.selling_price,
          length: product.length,
          width: product.width,
          height: product.height,
          publicUrl: product.publicUrl,
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération du produit:', error);
      }
    );
  }

  // Méthode pour mettre à jour les données du produit
  updateProduct(): void {
    if (this.productForm.valid) {
      this.productService.updateProduct(this.productId, this.productForm.value).subscribe(
        () => {
          // Affiche un message de succès après la mise à jour
          this.toastr.success('Produit mis à jour avec succès!', 'Succès');
          // Rediriger vers la page des produits après la mise à jour
          this.router.navigate(['/produits-services/produits']);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du produit:', error);
          // Afficher un message d'erreur si la mise à jour échoue
          this.toastr.error('Une erreur est survenue lors de la mise à jour du produit.', 'Erreur');
        }
      );
    } else {
      console.log('Le formulaire est invalide');
      this.toastr.error('Veuillez remplir correctement tous les champs obligatoires.', 'Erreur');
    }
  }
}
