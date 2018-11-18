import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-device-view',
  templateUrl: './device-view.component.html',
  styleUrls: ['./device-view.component.css']
})
export class DeviceViewComponent implements OnInit {

  constructor(
    private api: ApiService,
    private ds: DataService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.getDeviceTwin();
    this.connect();
  }
  editMode = false;
  device: any;
  deviceId;

  isUpdated: boolean;

  getDeviceTwin() {
      this.device = this.ds.getData();
      if (this.device){
        this.isUpdatedCheck();
      }
      else {
      this.route.params.subscribe(params => {
        this.deviceId = params['id'];
        this.api.getDeviceTwin(this.deviceId)
          .subscribe(data => {
            console.log(data);
            this.device = data;
            this.isUpdatedCheck()
          });
        });
      }
      
  }

  compareThresholds(a, b) {
    if( a.DesiredState.Threshold.Temperature.value === b.DesiredState.Threshold.Temperature.value
      && a.DesiredState.Threshold.Humidity.value === b.DesiredState.Threshold.Humidity.value &&
      a.DesiredState.Threshold.Pressure.value === b.DesiredState.Threshold.Pressure.value) {
        return true;
      } else return false;
  }

  isUpdatedCheck() {
    console.log('Update check');
    console.log(JSON.stringify(this.device.DesiredState));
    console.log(JSON.stringify(this.device.ReportedState));

    console.log(this.compareThresholds(this.device, this.device));
    if(this.compareThresholds(this.device, this.device)){
      this.isUpdated = true;
      console.log('Device is updated');
    }
    else{
      this.isUpdated = false;
      console.log('device is not updated');
    }
  }

  toggleEdit() {
    if(this.editMode==true)
      this.editMode=false;
    else
      this.editMode=true
  }

  onSubmit() {
      console.log('device has changes');
      this.editMode = false;
      this.isUpdated = false;

      this.api.setDesiredState(this.device.deviceId,'Temperature',this.device.DesiredState.Threshold.Temperature.value, this.device.DesiredState.Threshold.Temperature.unit)
        .subscribe(data => {
          console.log(data);
          this.isUpdatedCheck();
        });
        this.api.setDesiredState(this.device.deviceId,'Humidity',this.device.DesiredState.Threshold.Humidity.value, this.device.DesiredState.Threshold.Humidity.unit)
        .subscribe(data => {
          console.log(data);
          this.isUpdatedCheck();
        });
        this.api.setDesiredState(this.device.deviceId,'Pressure',this.device.DesiredState.Threshold.Pressure.value, this.device.DesiredState.Threshold.Pressure.unit)
        .subscribe(data => {
          console.log(data);
          this.isUpdatedCheck();
        });

    
  }

  connect(): void {
    let source = new EventSource('http://localhost:3000/api/service/device/stream');
    source.addEventListener('message', event => {

      var msg = event['data'];
      let json = JSON.parse(msg);
      console.log(json);

        if(json.DeviceId == this.deviceId && json.msgType == "Alarm") {
            let type = json.type;
            this.device.Alarms[type] = json.value;
            console.log(this.device.Alarms[type]);
            this.isUpdatedCheck();
        }
        if(json.DeviceId == this.deviceId && json.msgType == "Report") {
          this.device.ReportedState = json.ReportedState
          this.isUpdatedCheck();
      }
      });
  }
}
