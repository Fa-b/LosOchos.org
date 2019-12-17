import { Injectable } from '@angular/core';
import { DeviceManagerService, Device } from './device-manager.service';
import { ILightDevice } from './devices';

export class LightDevice extends Device implements ILightDevice {
  rgb: boolean;
  brightness: number;
  on_state: boolean;
  on: (event: string | symbol, listener: (...args: any[]) => void) => LightDevice;
  constructor(payload: any, on_state: boolean=false, brightness: number=0, rgb: boolean=false) {
    super(payload);

    this.on_state = on_state;
    this.brightness = brightness;
    this.rgb = rgb;
  } 
}

@Injectable({
  providedIn: 'root'
})
export class LightsService {
  deviceList: Array<LightDevice>;

  constructor(public deviceManager: DeviceManagerService) {
    this.deviceList = [];

    console.log("Lights Service initialized");
  }

  load() {
    this.deviceManager.on('lightAttach', (device) => {
      // Add device entry to list
      this.deviceList.push(device);
    });

    this.deviceManager.on('lightDetach', (device) => {
      // find matching entry in list and remove from list
      let deviceIndex = this.deviceList.findIndex(entry => entry === device);
      if(deviceIndex >= 0) {
        this.deviceList.splice(deviceIndex, 1);
      }
    });
  }
}
