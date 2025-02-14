export interface Produit {
    id: number;
    nom: string;
    prix: number;
    quantite: number;
  }
  
  export interface Devis {
    id: number;
    client: string;
    date: string;
    produits: Produit[];
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
    statut: 'Brouillon' | 'Validé' | 'Facturé';
  }
  