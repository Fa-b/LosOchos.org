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
      // console.log(device);
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
      // use pat 'set' for changes
      this.deviceManager.set(device, packet);
    } else if (event === "store") {
      // Storing new configuration to EEPROM
      this.deviceManager.write_eeprom(device, packet);
    } else if (event === "detach") {
      this.deviceManager.debugCommandDetach(device);
    }
  }

  refreshAll(timeout: number): Promise<any> {
    let i = 0;

    return new Promise((resolve, reject) => {
      this.deviceManager.refreshList(timeout)
      .subscribe(
        (data) => {
          // Delete each unresponsive device
            i += 1;
            let deviceIndex = this.deviceList.findIndex(entry => entry === data);
            if (deviceIndex >= 0) {
              this.deviceList.splice(deviceIndex, 1);
            }
        },
        (error) =>{

        },
        () => {
          if(i > 0)
            reject("Refresh failed, removed " + i + " devices.");
          else
            resolve("Refresh successful :-)");
        });

    });
  }

  // Debug Commands
  debugAttach() {
    this.deviceManager.debugCommandAttach("Light");
  }
}
