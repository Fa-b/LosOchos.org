import { Component, ViewChild, AfterViewInit } from '@angular/core';
import {  Device } from '../device-manager.service';
import { IonReorderGroup } from '@ionic/angular';
import { LightsService } from '../lights.service';
import { ILightDevice } from '../devices';

@Component({
  selector: 'app-lights',
  templateUrl: 'lights.page.html',
  styleUrls: ['lights.page.scss']
})
export class LightsPage implements AfterViewInit {
  

  @ViewChild(IonReorderGroup, {static: false}) reorderGroup: IonReorderGroup;
  constructor(private lightsService: LightsService) {
    
  }

  ngAfterViewInit() {
    this.reorderGroup.disabled = true;
  }

  onViewInit(device) {
    device.on('change', (data) => {
      this.lightsService.deviceManager.set(device, data);
    });
  }

  // Todo: check
  doReorder(ev: any) {
    // Before complete is called with the items they will remain in the
    // order before the drag
    console.log('Before complete', this.lightsService.deviceList);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. Update the items variable to the
    // new order of items
    this.lightsService.deviceList = ev.detail.complete(this.lightsService.deviceList);

    // After complete is called the items will be in the new order
    console.log('After complete', this.lightsService.deviceList);
  }

  toggleReorderGroup() {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }

  // Debug commands
  onAttach() {
    this.lightsService.deviceManager.debugCommandAttach("Light");
  }

  onDetach(device) {
    this.lightsService.deviceManager.debugCommandDetach(device);
  }

  // onStateChange(device) {
  //   this.deviceManager.set(device, { on_state: device.on_state });
  // }

  // onBrightnessChange(device) {
  //   this.deviceManager.set(device, { brightness: device.brightness });
  // }

}
