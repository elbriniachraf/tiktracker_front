import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../userserrvice.service';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FontAwesomeModule, HttpClientModule, 
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'], // Correction de la propriété
  providers: [UserService], // Service injecté
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    // Création du formulaire avec des noms de contrôles harmonisés
    this.registerForm = this.fb.group({
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      country: ['', Validators.required],
      legalForm: ['', Validators.required],
      tva: [''], // Optionnel
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Appel du service pour soumettre les données
      this.userService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
          console.log('Utilisateur inscrit avec succès', response);
        },
        error: (err: any) => {
          console.error('Erreur lors de l\'inscription', err);
        },
      });
    } else {
      console.error('Formulaire invalide');
    }
  }
}
