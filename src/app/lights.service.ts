import { Injectable } from '@angular/core';
import { DeviceManagerService } from './device-manager.service';
import { LightDevice } from './devices';

@Injectable({
  providedIn: 'root'
})
export class LightsService {
  deviceList: Array<LightDevice>;
  constructor(public deviceManager: DeviceManagerService) {
    this.deviceList = [];

    console.log("Lights Service initialized");
  }

  // This uses Angular APP_INITIALIZE..
  // We have to subscribe to ALL events from backend before we establish the socket connection
  load() {
    this.deviceManager.on('lightAttach', (device) => {
      // Add device entry to list
      this.deviceList.push(device);
    });

    this.deviceManager.on('lightResponse', (device) => {
      // Received response
      console.log(device);
    });

    this.deviceManager.on('lightDetach', (device) => {
      // find matching entry in list and remove from list
      let deviceIndex = this.deviceList.findIndex(entry => entry === device);
      if (deviceIndex >= 0) {
        this.deviceList.splice(deviceIndex, 1);
      }
    });
  }

  emit(event: string | symbol, device: LightDevice, properties?: Array<string | symbol>) {
    let packet = {};
    if (properties) {
      properties.forEach((element) => {
        if (device.hasOwnProperty(element)) {
          packet[element] = device[element];
        }
      });
    }

    if (event === "change") {
      this.deviceManager.set(device, packet);
    } else if (event === "detach") {
      this.deviceManager.debugCommandDetach(device);
    }
  }

  // Debug Commands
  debugAttach() {
    this.deviceManager.debugCommandAttach("Light");
  }
}
