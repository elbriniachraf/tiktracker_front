import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular'; // Importation du module FullCalendar

import { MyCalendarComponent } from './my-calendar/my-calendar.component';

@NgModule({
  declarations: [MyCalendarComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
  ],
  exports: [MyCalendarComponent],
})
export class MyCalendarModule {}
