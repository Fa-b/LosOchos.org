import { Component } from '@angular/core';
import { DeviceManagerService } from '../device-manager.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page {


  constructor(public deviceManager: DeviceManagerService) {

  }


}
// in der .ts ist typescript, in der html der zugehörige layout kram und in der css styling
// die komponenten müssen halt nur einmal gemacht werden