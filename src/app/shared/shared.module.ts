import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  imports: [
    CommonModule,
    GooglePlaceModule // Importez les modules nécessaires ici
  ],

})
export class SharedModule {}
