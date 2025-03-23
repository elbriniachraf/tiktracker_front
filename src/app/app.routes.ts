import { Routes , RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './register/register.component';
import { PageProduitComponent } from './page-produit/page-produit.component';
import { MyCalendarComponent } from './my-calendar/my-calendar/my-calendar.component';
import { EditProductComponent } from './edit-product/edit-product.component';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'main',
    component: MainPageComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirection par défaut
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'calendar', loadComponent: () => import('./my-calendar/my-calendar/my-calendar.component').then(m => m.MyCalendarComponent) },
      { path: 'my-cloud', loadComponent: () => import('./my-cloud/my-cloud.component').then(m => m.MyCloudComponent) },
      { path: 'devises', loadComponent: () => import('./devis/devis.component').then(m => m.DevisComponent) },
      { path: 'gestion', 
        
        children: [
          { path: '', redirectTo: 'clients', pathMatch: 'full' }, // Redirection par défaut vers clients
          { path: 'clients', loadComponent: () => import('./gestion/gestion.component').then(m => m.GestionComponent) },
          { path: 'fournisseurs', loadComponent: () => import('./gestion-fournisseur/gestion-fournisseur.component').then(m => m.GestionFournisseurComponent) },
          { path: 'prospects', loadComponent: () => import('./gestion-prospects/gestion-prospects.component').then(m => m.GestionProspectsComponent) },
          { path: 'contacts', loadComponent: () => import('./gestion-contacts/gestion-contacts.component').then(m => m.GestionContactsComponent) },
        ]
      },
      { path: 'produits-services', 
        component: PageProduitComponent,
        children: [
          { path: '', redirectTo: 'produits', pathMatch: 'full' }, // Redirection par défaut vers clients
          { path: 'produits', loadComponent: () => import('./list-produits/list-produits.component').then(m => m.ListProduitsComponent) },
          { path: 'edit-product/:id', component: EditProductComponent },      
        ]
      },
      { path: 'settings', loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent) },
    ],
  },

];

