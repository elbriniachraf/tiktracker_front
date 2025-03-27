import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../product.service';
import { ServiceService } from '../service.service';
import { TvaService } from '../tva-histories.service';

@Component({
  selector: 'app-tva-calcul',
  templateUrl: './tva-calcul.component.html',
  styleUrls: ['./tva-calcul.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule]
})
export class TvaCalculComponent implements OnInit {
  
  products: { label: string }[] = [];
  services: { name: string }[] = [];
  selectedProduct: string = '';
  selectedService: string = '';
  selectedTva: number = 0;
  priceInput: number = 0;
  resultPrice: number = 0;
  tvaAmount: number = 0;
  isHTtoTTC: boolean = true; // Mode HT → TTC par défaut

  tvaRates = [
    { label: 'TVA Normale', rate: 20 },
    { label: 'TVA Réduite', rate: 10 },
    { label: 'TVA Super Réduite', rate: 5.5 },
    { label: 'TVA Hyper Réduite', rate: 2.1 },
    { label: 'Exonéré de TVA', rate: 0 }
  ];

  constructor(
    private productService: ProductService,
    private serviceService: ServiceService,
    private tvaService: TvaService 
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(response => {
      this.products = response.data || response;
    }, error => {
      console.error('Erreur produits:', error);
    });

    this.serviceService.getAllServices().subscribe(response => {
      this.services = response.data || response;
    }, error => {
      console.error('Erreur services:', error);
    });
  }

  toggleCalculationMode(): void {
    this.isHTtoTTC = !this.isHTtoTTC;
    this.calculate();
  }

  calculate(): void {
    if (!this.priceInput || !this.selectedTva) {
      this.resultPrice = 0;
      this.tvaAmount = 0;
      return;
    }
  
    const tauxTVA = this.selectedTva / 100;
  
    if (this.isHTtoTTC) {
      this.tvaAmount = this.priceInput * tauxTVA;
      this.resultPrice = this.priceInput + this.tvaAmount;
    } else {
      this.resultPrice = this.priceInput / (1 + tauxTVA);
      this.tvaAmount = this.priceInput - this.resultPrice;
    }
  
    console.log('Prix saisi:', this.priceInput);
    console.log('TVA sélectionnée:', this.selectedTva);
    console.log('Taux TVA appliqué:', tauxTVA);
    console.log('Montant TVA calculé:', this.tvaAmount);
    console.log('Prix TTC calculé:', this.resultPrice);
  }
  

  onSubmit(): void {
    console.log('Produit sélectionné:', this.selectedProduct);
    console.log('Service sélectionné:', this.selectedService);
    console.log('TVA sélectionnée:', this.selectedTva + '%');
    console.log(this.isHTtoTTC ? 'Prix HT:' : 'Prix TTC:', this.priceInput + ' €');
    console.log(this.isHTtoTTC ? 'Prix TTC:' : 'Prix HT:', this.resultPrice + ' €');
    console.log('Montant TVA:', this.tvaAmount + ' €');

    this.saveToDatabase();
  }

  saveToDatabase(): void {
    const payload = {
      product: this.selectedProduct,
      service: this.selectedService,
      price_input: this.priceInput,
      tva_rate: Number(this.selectedTva),  
      tva_amount: this.tvaAmount,
      result_price: this.resultPrice,
      calculation_mode: this.isHTtoTTC ? 'HT → TTC' : 'TTC → HT'
    };
  
    console.log('Payload envoyé:', payload); 
  
    this.tvaService.saveTva(payload).subscribe({
      next: (response) => console.log('Données enregistrées avec succès:', response),
      error: (error) => console.error('Erreur lors de l’enregistrement:', error)
    });
  }
  
}
