// statistics.component.ts
import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  ngOnInit(): void {
    window.onload = () => {
      if (typeof google !== 'undefined' && google.charts) {
        this.loadGoogleCharts();
      } else {
        console.error("Google Charts is not loaded properly.");
      }
    };
  }

  loadGoogleCharts() {
    google.charts.load('current', { 'packages': ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(this.drawCharts);
  }

  drawCharts() {
    const dataJanuary = google.visualization.arrayToDataTable([
      ['Category', 'Sales'],
      ['January', 1000],
      ['February', 1500],
      ['March', 2000],
      ['April', 2500]
    ]);

    const dataFebruary = google.visualization.arrayToDataTable([
      ['Category', 'Sales'],
      ['January', 1200],
      ['February', 1600],
      ['March', 1800],
      ['April', 2100]
    ]);

    const dataMarch = google.visualization.arrayToDataTable([
      ['Category', 'Sales'],
      ['January', 1300],
      ['February', 1700],
      ['March', 1900],
      ['April', 2200]
    ]);

    const options = {
      title: 'Sales Statistics',
      chartArea: { width: '50%' },
      hAxis: {
        title: 'Sales in USD',
        minValue: 0
      },
      vAxis: {
        title: 'Month'
      }
    };

    const chartJanuary = new google.visualization.BarChart(document.getElementById('chart_div_january'));
    const chartFebruary = new google.visualization.BarChart(document.getElementById('chart_div_february'));
    const chartMarch = new google.visualization.BarChart(document.getElementById('chart_div_march'));

    chartJanuary.draw(dataJanuary, options);
    chartFebruary.draw(dataFebruary, options);
    chartMarch.draw(dataMarch, options);
  }

  goBack() {
    window.history.back();
  }
}
