import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { DeviceListComponent } from './device-list/device-list.component';

import { ApiService } from './api.service';
import { DeviceViewComponent } from './device-view/device-view.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './home/home.component'
import { ChartsModule } from 'ng2-charts';
import { FormsModule }   from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DeviceListComponent,
    DeviceViewComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ChartsModule,
    FormsModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
