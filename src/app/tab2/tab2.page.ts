import { Component } from '@angular/core';
import { DeviceManagerService } from '../device-manager.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public deviceManager: DeviceManagerService) {

  }

  onClick() {
    this.deviceManager.debugCommandAttach("LED");
  }

}
