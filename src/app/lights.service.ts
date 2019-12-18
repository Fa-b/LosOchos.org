import { Injectable } from '@angular/core';
import { DeviceManagerService } from './device-manager.service';
import { LightDevice } from './devices';
import { Dictionary } from 'lodash';

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

  detachAll(timeout: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let it = 0;
      // this.deviceList.forEach((element) => {
      //   this.refreshList[element] = it+=1;
      //   this.deviceManager.debugCommandDetach(element);
      // });

      setTimeout(() => {
        reject("Timed out :-(");
      }, timeout);

      // Todo: resolve when done..
        resolve();

    });
  }

  // Debug Commands
  debugAttach() {
    this.deviceManager.debugCommandAttach("Light");
  }
}
