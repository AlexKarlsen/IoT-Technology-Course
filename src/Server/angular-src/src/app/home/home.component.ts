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
    console.log("connecting to stream");
    let source = new EventSource('http://localhost:3000/api/telemetry/stream');
    source.addEventListener('message', event => {
      console.log('Event stream ready');

      // Handle telemetry data 
      let msg = event['data'];
      let json = JSON.parse(msg);
      console.log(json);
      json.TelemetryData.forEach(i => {
        if(i.Type == 'Temperature') {
          this.temperature.data.push({t: new Date(i.Timestamp), y : i.Value})
        }
        else if(i.Type == 'Humidity'){
          this.humidity.data.push({t: new Date(i.Timestamp), y : i.Value})
        }
        else if(i.Type == 'Pressure'){
          this.pressure.data.push({t: new Date(i.Timestamp), y : i.Value})
        }
      })
        
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
              this.temperature.data.push({t: new Date(j.Timestamp), y : j.Value});
            else if(j.Type == 'Humidity')
              this.humidity.data.push({t: new Date(j.Timestamp), y : j.Value});
            else if(j.Type == 'Pressure')
              this.pressure.data.push({t: new Date(j.Timestamp), y: j.Value});
          });

        });
        this.chartData.push(this.temperature);
        this.chartData.push(this.humidity);
        this.chartData.push(this.pressure);
        console.log(this.chartData);
        
      });
  }

  temperature = {data: [], label: 'Temperature'};
  humidity = {data: [], label: 'Humidity'};
  pressure = {data: [], label: 'Pressure'};

  chartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
          type: 'time',
          time: {
              unit: 'minute'
            }
      }]
    }
  };

  chartData;

  onChartClick(event) {
    console.log(event);
  }
}
