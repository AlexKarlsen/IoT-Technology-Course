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
  oldDevice;
  editMode = false;
  private device: any;
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
            this.oldDevice = data;
            this.isUpdatedCheck()
          });
        });
      }
      
  }

  isUpdatedCheck() {
    if(this.device.DesiredState == this.device.ReportedState)
      this.isUpdated = true;
    else
      this.isUpdated = false;
  }

  toggleEdit() {
    if(this.editMode==true)
      this.editMode=false;
    else
      this.editMode=true
  }

  onSubmit() {
    console.log('submit');
    console.log(this.oldDevice);
    console.log(this.device);
    //if(this.oldDevice.DesiredState.Threshold.temperature !== this.device.DesiredState.Threshold.temperature) {
      console.log('temperature has changes');
      console.log('this.device.DesiredState.Threshold.temperature.value');
      this.api.setDesiredState(this.device.deviceId,'temperature',this.device.DesiredState.Threshold.temperature.value, this.device.DesiredState.Threshold.temperature.unit)
        .subscribe(data => {
          console.log(data);

        })
    //}
    this.editMode = false;
  }
  connect(): void {
    let source = new EventSource('http://localhost:3000/stream');
    source.addEventListener('message', event => {
      let msg = event['data'];
      console.log(msg); 
      let json = JSON.parse(msg);
      console.log(json);
        if(json.DeviceId == this.deviceId) {
          this.device.ReportedState = json.ReportedState;
          if(this.device == json.msg)
          {
            this.isUpdated = true;
          }
        }
      });
  }
}
