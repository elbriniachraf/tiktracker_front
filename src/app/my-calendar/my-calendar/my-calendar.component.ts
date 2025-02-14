import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarService } from '../../calendar.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-my-calendar',
  templateUrl: './my-calendar.component.html',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, FormsModule,HttpClientModule],
  styleUrls: ['./my-calendar.component.css'],
  providers: [CalendarService], // Service injecté

})
export class MyCalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [], // Les événements seront chargés dynamiquement
    dateClick: this.handleDateClick.bind(this),
    editable: true,
    selectable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
  };

  drawerOpen = false;
  selectedDate: string | null = null;
  newEvent = { title: '', startDate: '', endDate: '', category: '' };

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  monthlyEvents: any;
  nextEvent: any;

  // Charger les événements depuis le service
  loadEvents(): void {
    this.calendarService.getEvents().subscribe(
      (events) => {
        // Mettre à jour les événements dans FullCalendar
        this.calendarOptions.events = events.map((event: any) => ({
          title: event.title,
          start: event.startDate,

        
          end: event.endDate,
        }));
        this.monthlyEvents =   this.calendarOptions.events ;

      },
      (error) => {
        console.error('Erreur lors du chargement des événements:', error);
      }
    );
  }

  // Ajouter un nouvel événement
  addEvent(): void {
    const eventToAdd = {
      title: this.newEvent.title,
      startDate: this.newEvent.startDate,
      endDate: this.newEvent.endDate,
      category: this.newEvent.category,
    };

    this.calendarService.addEvent(eventToAdd).subscribe(
      (response) => {
        console.log('Événement ajouté:', response);
        this.loadEvents(); // Recharger les événements pour inclure le nouveau
        this.closeDrawer();
      },
      (error) => {
        console.error('Erreur lors de l’ajout de l’événement:', error);
      }
    );
  }

  // Fermer le drawer
  closeDrawer(): void {
    this.drawerOpen = false;
    this.newEvent = { title: '', startDate: '', endDate: '', category: '' };
  }

  // Gérer le clic sur une date
  handleDateClick(arg: any): void {
    this.selectedDate = arg.dateStr;
    this.newEvent.startDate = arg.dateStr;
    this.drawerOpen = true;
  }
}
