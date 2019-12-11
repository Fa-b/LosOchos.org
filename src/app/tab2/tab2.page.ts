import { Component } from '@angular/core';
import { DeviceManagerService, LightDevice } from '../device-manager.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  deviceList: Array<LightDevice>;
  constructor(public deviceManager: DeviceManagerService) {
    this.deviceList = [];
    deviceManager.on('lightAttach', (device) => {
      this.deviceList.push(device);
    });

    deviceManager.on('lightDetach', (id) => {

      let deviceIndex = this.deviceList.findIndex(entry => entry.id === id);
      if(deviceIndex >= 0) {
        this.deviceList.splice(deviceIndex, 1);
      }
    });
  }

  onAttach() {
    this.deviceManager.debugCommandAttach("LED");
  }

  onDetach(id) {
    this.deviceManager.debugCommandDetach(id);
  }

}
