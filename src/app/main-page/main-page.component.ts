import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTachometerAlt, faCogs, faBox, faClipboardList, faFileInvoice, faCalendarAlt, faImages, faBell } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterOutlet, FontAwesomeModule,CommonModule],

  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  constructor(private router: Router) {}
  faDashboard = faTachometerAlt;
  faGestion = faCogs;
  faProduitsServices = faBox;
  faCommandes = faClipboardList;
  faFactures = faFileInvoice;
  faAgenda = faCalendarAlt;
  faMediatheque = faImages;
  faNotification = faBell;

  navigateTo(path: string): void {
    this.router.navigate([path]).then((success) => {
      if (success) {
        console.log('Navigation réussie vers', path);
      } else {
        console.error('Erreur lors de la navigation vers', path);
      }
    });
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path); // Retourne vrai si l'URL active ne contient pas le chemin
  }
  
}
