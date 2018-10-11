import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router'
import { DataService } from '../data.service'

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {

  constructor(
    private api: ApiService,
    private router: Router, 
    private ds: DataService ) { }

  ngOnInit() {
    this.getDevices();
  }

  devices;

  getDevices(){
    this.api.getAllDevices()
      .subscribe(data => {
        console.log(data);
        this.devices = data;
      });
  }

  onSelect(device): void {
    // Save the data to pass onto the post-detail component
    this.ds.setData(device);
    // navigate to component
    this.router.navigate(['/device/' + device.deviceId]);
  }

}
