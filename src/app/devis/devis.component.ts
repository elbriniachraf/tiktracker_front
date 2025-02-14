import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
@Component({
  selector: 'app-devis',
  templateUrl: './devis.component.html',
  standalone: true,

    imports: [ NgxDatatableModule, HttpClientModule,CommonModule,FontAwesomeModule,GoogleMapsModule,FormsModule,ReactiveFormsModule ],
  
  styleUrls: ['./devis.component.scss'],
    providers: [ClientService,DevisService], // Service injectéclie
  



})
export class DevisComponent implements OnInit {
  devis: any[] = [];
  selectedTab: string = 'create';  // Onglet par défaut

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
  this.filteredProduits[index] = [];
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


  constructor(private clientService: ClientService,private router: Router,private fb: FormBuilder, private devisService: DevisService, private http: HttpClient) {
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
