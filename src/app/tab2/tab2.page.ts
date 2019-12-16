import { Component } from '@angular/core';
import { DeviceManagerService, Device } from '../device-manager.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  deviceList: Array<Device>;
  constructor(public deviceManager: DeviceManagerService) {
    this.deviceList = [];

    deviceManager.on('lightAttach', (device) => {
      // Add device entry to list
      this.deviceList.push(device);
    });

    deviceManager.on('lightDetach', (device) => {
      // find matching entry in list and remove from list
      let deviceIndex = this.deviceList.findIndex(entry => entry.id === device.id);
      if(deviceIndex >= 0) {
        this.deviceList.splice(deviceIndex, 1);
      }
    });
  }

  // Debug commands
  onAttach() {
    this.deviceManager.debugCommandAttach("LED");
  }

  onDetach(id) {
    this.deviceManager.debugCommandDetach(id);
  }

  onStateChange(device) {
    this.deviceManager.set({ id: device.id, payload: { on_state: device.on_state } });
  }

  onBrightnessChange(device) {
    this.deviceManager.set({ id: device.id, payload: { brightness: device.brightness } });
  }

}
