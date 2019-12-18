import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IonReorderGroup } from '@ionic/angular';
import { LightsService } from '../lights.service';

@Component({
  selector: 'app-lights',
  templateUrl: 'lights.page.html',
  styleUrls: ['lights.page.scss']
})
export class LightsPage implements AfterViewInit {

  @ViewChild(IonReorderGroup, {static: true}) reorderGroup: IonReorderGroup;
  constructor(private lightsService: LightsService) {

  }

  ngAfterViewInit() {
    // this.reorderGroup.disabled = true;
    console.log("Here comes the lights tab...");
  }


  // Todo: hide deviceList here... use accessor functions instead
  // must also happen in html :-(
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

  doRefresh(event) {
    // Todo: clear deviceList and reconnect to backend
    // Possibly find a even better solution that does not involve a real disconnect
    // of all connected devices (e.g. republish with timeout)

    this.lightsService.detachAll(5000)
    .then(
      (data) => {
        event.target.complete();
        console.log(data);
      }
    ).catch(
      (error) => {
        event.target.complete();
        console.log(error);
      });
  }

  /** Todo:
   * - manage to store index of sticky device to local storage and
   * - order list respecting given index (filter?!)
   * 
   *
   */
  onSticky(device) {
    console.log(this.lightsService.deviceList.findIndex(entry => entry == device));
  }

  // Debug commands
  onAttach() {
    this.lightsService.debugAttach();
  }

  // onDetach(device) {
  //   this.lightsService.deviceManager.debugCommandDetach(device);
  // }

  // onStateChange(device) {
  //   this.deviceManager.set(device, { on_state: device.on_state });
  // }

  // onBrightnessChange(device) {
  //   this.deviceManager.set(device, { brightness: device.brightness });
  // }

}
