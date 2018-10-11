import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Carrier object to pass data from a component to another one via this service.
  private serviceData;
  public setData(data){
   this.serviceData = data;
   console.log(this.serviceData)
  }
  public getData(){
    return this.serviceData;
  }
}
