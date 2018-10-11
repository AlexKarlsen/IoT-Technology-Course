import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private api: ApiService){}
  ngOnInit(){
    this.getData();
    this.connect();
  }

  connect(): void {
    let source = new EventSource('http://localhost:3000/api/telemetry/stream');
    source.addEventListener('message', event => {
      let msg = event['data'];
      console.log(msg); 
      let json = JSON.parse(msg);
      console.log(json);
        if(json.TelemetryData.Type == 'Temperature') {
          this.temperature.data.push({t: new Date(json.TelemetryData.Timestamp), y : json.TelemetryData.Value})
        }
        else if(json.TelemetryData.Type == 'Humidity'){
          this.humidity.data.push({t: new Date(json.TelemetryData.Timestamp), y : json.TelemetryData.Value})
        }
        console.log(this.temperature) 
        this.chartData = this.chartData.slice();
      });

  }

  getData() {
    this.api.getAllTelemetry()
      .subscribe(data => {
        this.chartData = [];
        console.log(data);
        data.forEach(i => {
          i.TelemetryData.forEach(j => {
            if(j.Type == 'Temperature')
              this.temperature.data.push({t: new Date(j.Timestamp), y : j.Value})
            else if(j.Type == 'Humidity')
              this.humidity.data.push({t: new Date(j.Timestamp), y : j.Value})
          });

        });
        this.chartData.push(this.temperature)
        this.chartData.push(this.humidity)
        console.log(this.chartData)
        
      });
  }

  temperature = {data: [], label: 'Temperature'};
  humidity = {data: [], label: 'Humidity'};

  chartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
          type: 'time',
          time: {
              unit: 'second'
            }
      }]
    }
  };

  chartData;

  onChartClick(event) {
    console.log(event);
  }
}
