import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { DevisService } from '../services/devis.service';
import { Devis } from '../../app/models/devise.model';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GoogleMapsModule } from '@angular/google-maps';
import { ClientService } from '../client.service';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { faPrint, faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';
import { FactureService } from '../services/facture.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RelanceService } from '../services/relance.service';
import { AvoirService } from '../services/avoir.service';
@Component({
  selector: 'app-devis',
  templateUrl: './devis.component.html',
  standalone: true,

    imports: [ NgxDatatableModule, HttpClientModule,CommonModule,FontAwesomeModule,GoogleMapsModule,FormsModule,ReactiveFormsModule ],
  
  styleUrls: ['./devis.component.scss'],
    providers: [ClientService,DevisService,FactureService,AvoirService,RelanceService], // Service injectéclie
  



})
export class DevisComponent implements OnInit {
  devis: any[] = [];

  goAvoir(facture: any): void {
    // Changer d'onglet pour créer un Avoir et transmettre la facture associée
    this.selectedTab = 'createAvoir';
    this.newAvoir.client_id=facture.client_id;
    this.newAvoir.facture_id=facture._id;

    console.log('Créer un Avoir pour la facture', facture);
    // Tu peux ici initialiser l'objet `newAvoir` avec les informations de la facture
    // Exemple : this.newAvoir.facture_id = facture.id;
  }

  goRelance(facture: any): void {
    // Changer d'onglet pour créer une Relance et transmettre la facture associée
    this.selectedTab = 'createRelance';
    console.log('Créer une Relance pour la facture', facture);
    // Tu peux ici initialiser l'objet `newRelance` avec les informations de la facture
    // Exemple : this.newRelance.facture_id = facture.id;
  }
 
  sendFactureByEmail(factureId: number) {
    console.log('Envoyer la facture par email', factureId);
    // Logic pour envoyer la facture par email via un service API
  }
  baseCurrency: string = 'USD'; // Devise par défaut (tu peux mettre 'MAD' si tu veux)

  selectedTab: string = 'Currency';  // Onglet par défaut

  envoyerParEmail() {
    const destinataire = prompt("Entrez l'email du destinataire :");
    if (destinataire) {
      window.location.href = `mailto:${destinataire}?subject=Votre devis&body=Voici votre devis en pièce jointe.`;
    }
  }
  calculerTotalTTC(): number {
    let total = 0;
    this.produits.controls.forEach(produit => {
      const prix = produit.get('prix')?.value;
      const quantite = produit.get('quantite')?.value;
      if (prix && quantite) {
        total += prix * quantite;
      }
    });
    return total;
  }

  imprimerDevis() {
    if (!this.clientInput || this.produits.controls.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez saisir les informations du client et ajouter au moins un produit.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }
    const doc = new jsPDF({
      orientation: 'p', // Portrait
      unit: 'mm',
      format: 'a4' // Format A4
    });
  
    const margin = 15;
    let y = margin; // Position Y de départ
  
    // ✅ Ajout du logo
    const imgWidth = 40;
    const imgHeight = 15;
    doc.addImage('logo.png', 'PNG', margin, y, imgWidth, imgHeight);
  
    // ✅ Titre centré
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Aperçu du Devis', 105, y + 10, { align: 'center' });
  
    // ✅ Adresse en haut à droite
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Adresse de l\'entreprise', 150, y);
    doc.text('123 Rue Exemple, Ville, Code Postal', 150, y + 5);
  
    y += 25;
  
    // ✅ Informations du client
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Informations Client', margin, y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nom: ${this.clientInput}`, margin, y + 6);
    doc.text('Email: elbriniachrafgmail.com', margin, y + 12);
    doc.text('Téléphone: 0610868038', margin, y + 18);
  
    y += 30;
  
    // ✅ Tableau des produits
    const tableHeaders = ['Produit', 'Quantité', 'Prix Unitaire', 'Total'];
    const colWidths = [60, 30, 40, 40]; // Largeurs des colonnes
    let xPos = margin;
  
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    
    // ✅ Dessiner l'en-tête du tableau
    doc.setFillColor(200, 200, 200); // Fond gris clair pour l'en-tête
    doc.rect(margin, y - 5, colWidths.reduce((a, b) => a + b, 0), 8, 'F'); // Rectangle de fond
    xPos = margin;
    
    for (let i = 0; i < tableHeaders.length; i++) {
      doc.text(tableHeaders[i], xPos + 2, y);
      xPos += colWidths[i];
    }
    y += 6;
    doc.setFont('helvetica', 'normal');
  
    // ✅ Ajouter les produits dynamiquement
    this.produits.controls.forEach((produit: any, index: number) => {
      let xPos = margin;
  
      // ✅ Dessiner la ligne de séparation
      if (index > 0) {
        doc.line(margin, y - 3, margin + colWidths.reduce((a, b) => a + b, 0), y - 3);
      }
  
      doc.text(produit.get('produitInput')?.value, xPos + 2, y);
      xPos += colWidths[0];
      doc.text(produit.get('quantite')?.value.toString(), xPos + 2, y);
      xPos += colWidths[1];
      doc.text(produit.get('prix')?.value.toString() + '€', xPos + 2, y);
      xPos += colWidths[2];
      doc.text((produit.get('quantite')?.value * produit.get('prix')?.value).toFixed(2) + '€', xPos + 2, y);
      y += 6;
    });
  
    y += 10;
  
    // ✅ Total TTC encadré
    doc.setFont('helvetica', 'bold');
    doc.rect(margin, y - 6, 80, 8); // Encadrer la zone Total
    doc.text(`Total TTC: ${this.calculerTotalTTC()}€`, margin + 2, y);
  
    y += 20;
  
    // ✅ Zone de signature stylée
    doc.text('Signature du client :', margin, y);
    doc.setLineWidth(0.5); // Épaisseur de la ligne
    doc.line(margin, y + 5, margin + 60, y + 5); // Ligne de signature
    doc.setFontSize(9);
    doc.text('(Fait à la date de signature)', margin, y + 10);
  
    // ✅ Sauvegarde du fichier
    doc.save('devis.pdf');
  }
  
  
  
  devisForm: FormGroup;
  clientInput = '';
  produitInput = '';
  clientsFiltres:any = [];
  produitsList :any=[];
  filteredProduits: any[] = [];
  faPrint = faPrint;
  faEnvelope = faEnvelope;
  selectionnerClient(client: any) {
    console.log("client");
    console.log(client.nom);
    
    
    this.clientInput = client.nom;
  
  
    this.devisForm.patchValue({ client: client.nom });
    this.devisForm.patchValue({ client_id: client._id });
    this.clientsFiltres = [];
  }

  selectionnerClient2(client: any) {
    console.log("client");
    console.log(client.nom);
    
    
    this.facture.client = client.nom;
    this.facture.client_id = client._id;
  
  
    this.clientsFiltres = [];
  }



  filteredProduits2: { [index: number]: any[] } = {};   // Initialisé comme un objet vide

filterProduits2(index: number, searchText: string) {
  if (searchText && searchText.trim() !== '') {
    this.http.get<any[]>(`http://127.0.0.1:8000/api/searchproducts?search=${searchText}`).subscribe(
      (response) => {
        this.filteredProduits2[index] = response;
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.filteredProduits2[index] = [];
      }
    );
  } else {
    this.filteredProduits2[index] = [];
  }
}



rates: any = {};
  filteredRates: { key: string, value: number }[] = [];

  // Liste des devises les plus populaires
  topCurrencies = ['MAD','USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'AED', 'SAR'];

  currencyDetails: Record<string, { country: string, designation: string }> = {
    USD: { country: 'États-Unis', designation: 'Dollar américain' },
    EUR: { country: 'Zone Euro', designation: 'Euro' },
    GBP: { country: 'Royaume-Uni', designation: 'Livre sterling' },
    CAD: { country: 'Canada', designation: 'Dollar canadien' },
    AUD: { country: 'Australie', designation: 'Dollar australien' },
    JPY: { country: 'Japon', designation: 'Yen japonais' },
    CHF: { country: 'Suisse', designation: 'Franc suisse' },
    CNY: { country: 'Chine', designation: 'Yuan chinois' },
    AED: { country: 'Émirats Arabes Unis', designation: 'Dirham des Émirats' },
    SAR: { country: 'Arabie Saoudite', designation: 'Riyal saoudien' },
    MAD: { country: 'Maroc', designation: 'Dirham marocain' }
  };

  isModalOpen = false;
  pdfUrl: any;



  // Ouvre la modal pour afficher la facture
  showFacture(facture: any) {
    console.log(facture.pdf_path);
    
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl("http://127.0.0.1:8000/"+facture.pdf_path);
    this.isModalOpen=true;
  }

  // Ferme la modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Télécharge la facture en PDF
  downloadFacture(facture: any): void {
    const link = document.createElement('a');
    link.href = "http://127.0.0.1:8000/"+facture.pdf_path;
    link.download = `Facture_${facture.id}.pdf`;
    link.click();
  }
  

  loadExchangeRates() {
    this.factureService.getExchangeRates(this.baseCurrency).subscribe({
        next: (data) => {
            console.log("Réponse API:", data);

            // Extraire les quotes
            this.rates = this.convertQuotesToRates(data.quotes);

            // Filtrer et afficher les top currencies
            this.filterTopCurrencies();
        },
        error: (err) => console.error('Erreur lors de la récupération des taux de change:', err)
    });
}

convertQuotesToRates(quotes: Record<string, number> | undefined | null): Record<string, number> {
  if (!quotes) {
      console.warn("Aucun quotes reçu pour conversion");
      return {};  // Retourne un objet vide si quotes est null ou undefined
  }

  console.log("quotes");
  console.log(quotes);

  const rates: Record<string, number> = {};
  for (const [key, value] of Object.entries(quotes)) {
      const currency = key.replace('USD', ''); // Convertir USDAED -> AED
      rates[currency] = value;
  }
  return rates;
}



filterTopCurrencies() {
  this.filteredRates = Object.entries(this.rates)
    .filter(([key, _]) => this.topCurrencies.includes(key))
    .map(([key, value]) => ({ key, value: value as number }));
}

factures: any[] = [];
public relances: any[] = [];
getRelances(): void {
  this.relanceService.getRelances().subscribe((data) => {
    this.relances = data;
  });
}

// Créer une nouvelle relance
createRelance(): void {
  const newRelance = {
    facture_id: 1, // Remplacer avec l'ID de la facture
    client_id: 2, // Remplacer avec l'ID du client
    date: new Date(),
    status: 'envoyée',
    message: 'Votre facture est en retard',
    amount_due: 100,
  };

  this.relanceService.createRelance(newRelance).subscribe((response) => {
    console.log('Relance créée', response);
    this.getRelances(); // Rafraîchir la liste des relances
  });
}

public avoirs: any[] = [];
getAvoirs(): void {
  this.avoirService.getAvoirs().subscribe((data) => {
    console.log("data");
    console.log(data);
    
    this.avoirs = data;
  });


}
 calculateTTC2(): void {
    const totalHT = this.newAvoir.total_ht || 0;
    const totalTVA = this.newAvoir.total_tva || 0;
    this.newAvoir.total_ttc = totalHT + totalTVA;
  }

loadFactures() {
  this.factureService.getAllFactures().subscribe({
    next: (data) => {
      this.factures = data;
      console.log(data);
      
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des factures', err);
    }
  });
}
  

selectProduit2(index: number, produit: any) {
  // Quand on sélectionne un produit, on remplit les champs et on cache les suggestions
  this.facture.produits[index].produit = produit.label;
  this.facture.produits[index].id = produit._id;

  this.facture.produits[index].prixUnitaire = produit.selling_price;
  this.filteredProduits[index] = [];

  const suggestionsList = document.getElementById(`suggestionsList-${index}`);

  if(suggestionsList){
    suggestionsList.style.display =  'none';

  }
  this.calculerTotalFacture(); // Recalcule total si besoin
}

  filterProduits(index: number) {
    const produitControl = this.produits.controls[index];
    // Vérifie si le contrôle existe et si le champ 'produitInput' existe également
    if (produitControl && produitControl.get('produitInput')) {
      const produitInputValue = produitControl.get('produitInput')?.value;
  
      if (produitInputValue && produitInputValue.trim() !== '') {
        this.http.get<any[]>(`http://127.0.0.1:8000/api/searchproducts?search=${produitInputValue}`).subscribe(
          (response) => {
            this.filteredProduits[index] = response; // Mise à jour des produits filtrés
          },
          (error) => {
            console.error('Error fetching products:', error);
            this.filteredProduits[index] = [];
          }
        );
      } else {
        this.filteredProduits[index] = [];
      }
    }
  }
  

// Logic to select a product from the list
selectProduit(product: any, index: number) {
  // Utilisation de patchValue pour mettre à jour le nom du produit sélectionné
  this.produits.controls[index].patchValue({ produitInput: product.label });

  
  this.produits.controls[index].patchValue({ prix:product.selling_price });
  // Réinitialisation de la liste filtrée pour cet index
  this.filteredProduits2= {};
}

  
  rechercherClients() {

    if (this.clientInput.length >= 2) {
      this.http.get(`http://127.0.0.1:8000/api/searchclients?query=${this.clientInput}`)
        .subscribe((response: any) => {
          this.clientsFiltres = response.data;
        });
    } else {
      this.clientsFiltres = [];
    }
  }


  rechercherClients2() {

    if (this.facture.client.length >= 2) {
      this.http.get(`http://127.0.0.1:8000/api/searchclients?query=${this.clientInput}`)
        .subscribe((response: any) => {
          this.clientsFiltres = response.data;
        });
    } else {
      this.clientsFiltres = [];
    }
  }

  facture = {
    client: '',
    client_id: '',
    date: '',

    produits: [
      { produit: '', quantite: 1, prixUnitaire: 0,id:"" }
    ]
  };

  totalTTC = 0;
  totalHT = 0;
  tva = 0;
  calculerTotalFacture() {
    let totalHT = 0;
    this.facture.produits.forEach(produit => {
        totalHT += (produit.quantite * produit.prixUnitaire);
    });

    this.totalHT = totalHT;

    const tauxTVA = this.tva ? this.tva / 100 : 0;
    const montantTVA = totalHT * tauxTVA;

    this.totalTTC = totalHT + montantTVA;
}


  ajouterProduitFacture() {
    this.facture.produits.push({ produit: '', quantite: 1, prixUnitaire: 0 ,id:""});
    this.calculerTotal();
  }

  supprimerProduitFacture(index: number) {
    this.facture.produits.splice(index, 1);
    this.calculerTotal();
  }



  creerFacture() {
    const factureAEnvoyer = {
      ...this.facture,
      totalTTC: this.totalTTC,
      totalHT: this.totalHT,
      tva: this.tva
    };

    this.factureService.createFacture(factureAEnvoyer).subscribe({
      next: (response) => {
        console.log('Facture créée avec succès:', response);
        Swal.fire({
          icon: 'success',
          title: 'Facture créé',
          text: 'La Facture a été créé avec succès.',
          toast: true,  // Active le mode toast
          position: 'top-end',  // Vous pouvez définir la position (ex: top-right, bottom-left, etc.)
          showConfirmButton: false,  // Masquer le bouton de confirmation
          timer: 3000,  // Le toast disparaît après 3 secondes
          timerProgressBar: true,  // Affiche une barre de progression pendant le décompte
          didOpen: () => {
            Swal.showLoading();  // Optionnel : afficher l'animation de chargement pendant l'affichage
          }
        });
        this.selectedTab="listeFacture";
      },
      error: (err) => {
        console.error('Erreur lors de la création de la facture:', err);
        alert('Erreur lors de la création de la facture.');
      }
    });
  }

  constructor(private avoirService: AvoirService,private relanceService: RelanceService,private sanitizer: DomSanitizer,private clientService: ClientService,private router: Router,private fb: FormBuilder, private devisService: DevisService, private factureService: FactureService,private http: HttpClient) {
    this.devisForm = this.fb.group({
      produits: this.fb.array([this.createProduit()]) ,
      client: ['', Validators.required],
      client_id: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
    });
  }

  createProduit(): FormGroup {
    return this.fb.group({
      produitInput: ['', Validators.required],
      prix: [null, Validators.required],
      quantite: [null, Validators.required]
    });
  }

  
  ngOnInit(): void {
    // Appeler la méthode pour récupérer les devis
    this.devisService.getDevis().subscribe(
      (response) => {
        this.devis = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des devis', error);
      }
    );
    this.loadExchangeRates();
  this.loadFactures();
  this.getAvoirs();
  this.getRelances();


  }
  public newAvoir = {
    client_id: null,
    facture_id: null,
    date: '',
    total_ttc: 0,
    total_ht: 0,
    total_tva: 0,
    reason: ''
  };
  createAvoir(): void {
    this.avoirService.createAvoir(this.newAvoir).subscribe(response => {
      console.log('Avoir créé', response);
      Swal.fire({
        icon: 'success',
        title: 'Avoir créé',
        text: 'L\'avoir a été créé avec succès.',
        toast: true,  // Active le mode toast
        position: 'top-end',  // Vous pouvez définir la position (ex: top-right, bottom-left, etc.)
        showConfirmButton: false,  // Masquer le bouton de confirmation
        timer: 3000,  // Le toast disparaît après 3 secondes
        timerProgressBar: true,  // Affiche une barre de progression pendant le décompte
        didOpen: () => {
          Swal.showLoading();  // Optionnel : afficher l'animation de chargement pendant l'affichage
        }
      });
      this.selectedTab="listeAvoirs";
      
      // Tu peux ajouter une notification ou redirection ici
    });
  }

  fraisDeplacements = [
    { client: 'Client 1', date: new Date('2025-01-01'), montant: 120, motif: 'Transport' },
    { client: 'Client 2', date: new Date('2025-02-12'), montant: 80, motif: 'Livraison' },
    { client: 'Client 3', date: new Date('2025-03-05'), montant: 150, motif: 'Service de maintenance' }
  ];

  // Objet pour le formulaire d'ajout
  newFrais = {
    client: '',
    date: '',
    montant: 0,
    motif: ''
  };


  // Méthode pour créer un nouveau frais de déplacement
  createFraisDeplacement() {
    if (this.newFrais.client && this.newFrais.date && this.newFrais.montant && this.newFrais.motif) {
      this.fraisDeplacements.push({
        ...this.newFrais,
        date: new Date(this.newFrais.date) // On convertit la date au bon format
      });
      // Réinitialiser le formulaire
      this.newFrais = { client: '', date: '', montant: 0, motif: '' };
    }
  }

  // Méthode pour supprimer un frais de déplacement
  deleteFrais(index: number): void {
    this.fraisDeplacements.splice(index, 1);
  }

  // Méthode pour modifier un frais de déplacement
  editFrais(index: number): void {
    const frais = this.fraisDeplacements[index];
    this.newFrais.client = frais.client;
    this.newFrais.date = frais.date.toISOString().substring(0, 10);
    this.newFrais.montant = frais.montant;
    this.newFrais.motif = frais.motif;

    // Optionnel: Supprimer l'élément en attendant modification (ou autre logique)
    this.fraisDeplacements.splice(index, 1);
  }

  get produits(): FormArray {
    return this.devisForm.get('produits') as FormArray;
  }

  ajouterProduit() {
    this.produits.push(this.fb.group({
      produitInput: ['', Validators.required],
      prix: [0, Validators.required],
      quantite: [1, Validators.required]
    }));
  }

  supprimerProduit(index: number) {
    this.produits.removeAt(index);
  }

  calculerTotal(): { totalHT: number, totalTVA: number, totalTTC: number } {
    let totalHT = 0;
    this.produits.controls.forEach(prod => {
      totalHT += prod.value.prix * prod.value.quantite;
    });
    const totalTVA = totalHT * 0.2; // TVA à 20%
    const totalTTC = totalHT + totalTVA;
    return { totalHT, totalTVA, totalTTC };
  }

  enregistrerDevis() {
    if (!this.clientInput || this.produits.controls.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez saisir les informations du client et ajouter au moins un produit.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }
  
    const { totalHT, totalTVA, totalTTC } = this.calculerTotal();
    const nouveauDevis = {
      client: this.devisForm.value.client,
      client_id: this.devisForm.value.client_id,
      date: this.devisForm.value.date,
      produits: this.devisForm.value.produits,
      totalHT,
      totalTVA,
      totalTTC,
      statut: 'Brouillon'
    };
  

    console.log(nouveauDevis);
    
    this.devisService.ajouterDevis(nouveauDevis).subscribe(
      (response) => {
        console.log('Devis enregistré', response);
  
        // ✅ Belle alerte de confirmation
        Swal.fire({
          icon: 'success',
          title: 'Devis enregistré !',
          text: 'Votre devis a été enregistré avec succès.',
          showConfirmButton: true,
          confirmButtonText: 'OK',
          timer: 3000
        });
  
         // Appeler la méthode pour récupérer les devis
    this.devisService.getDevis().subscribe(
      (response) => {
        this.devis = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des devis', error);
      }
    );
        this.devisForm.reset();
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement du devis', error);
  
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de l’enregistrement du devis. Veuillez réessayer.',
          showConfirmButton: true,
          confirmButtonText: 'OK'
        });
      }
    );
  }
  

  convertirEnFacture(devis: any) {
    Swal.fire({
      title: 'Confirmer la conversion',
      text: 'Voulez-vous convertir ce devis en facture ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, convertir',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        devis.statut = 'Facturé'; // Mettre à jour le statut localement
        this.devisService.mettreAJourDevis(devis._id, { statut: 'Facturé' }).subscribe(() => {
          Swal.fire('Converti !', 'Le devis a été converti en facture.', 'success');
        }, error => {
          Swal.fire('Erreur', 'Une erreur est survenue lors de la conversion.', 'error');
        });
      }
    });
  }
  
  envoyerParMail(devis: any) {
    Swal.fire({
      title: 'Envoyer par e-mail',
      text: 'Voulez-vous envoyer ce devis par e-mail au client ?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Oui, envoyer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.devisService.envoyerDevisParMail(devis._id).subscribe(() => {
          Swal.fire('Envoyé !', 'Le devis a été envoyé avec succès.', 'success');
        }, error => {
          Swal.fire('Erreur', 'Une erreur est survenue lors de l\'envoi.', 'error');
        });
      }
    });
  }
  
  annulerDevis(devis: any) {
    Swal.fire({
      title: 'Annuler le devis',
      text: 'Voulez-vous vraiment annuler ce devis ? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        devis.statut = 'Annulé'; // Mettre à jour le statut localement
        this.devisService.mettreAJourDevis(devis._id, { statut: 'Annulé' }).subscribe(() => {
          Swal.fire('Annulé !', 'Le devis a été annulé.', 'success');
        }, error => {
          Swal.fire('Erreur', 'Une erreur est survenue lors de l\'annulation.', 'error');
        });
      }
    });
  }
  
  voirDetails(devis: any) {
    Swal.fire({
      title: `Détails du devis #${devis._id}`,
      html: `
        <p><strong>Client :</strong> ${devis.client}</p>
        <p><strong>Date :</strong> ${devis.date}</p>
        <p><strong>Total TTC :</strong> ${devis.totalTTC} €</p>
        <p><strong>Statut :</strong> ${devis.statut}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Fermer'
    });
  }
  

}
