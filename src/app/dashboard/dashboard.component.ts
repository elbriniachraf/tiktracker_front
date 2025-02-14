import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {

  ngAfterViewInit() {
    this.renderChart();
  }

  renderChart() {
    const ctx = (document.getElementById('revenueChart') as HTMLCanvasElement).getContext('2d');

    if(ctx!=null)
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Revenus Mensuels (€)',
          data: [1200, 1900, 3000, 5000, 2400, 3500],
          backgroundColor: '#0078d4'
        }]
      }
    });
  }

  navigateTo(section: string) {
    console.log(`Navigation vers ${section}`);
  }
}
