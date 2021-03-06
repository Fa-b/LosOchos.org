import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IonReorderGroup, NavController } from '@ionic/angular';
import { LightsService } from '../lights.service';

@Component({
  selector: 'app-lights',
  templateUrl: 'lights.page.html',
  styleUrls: ['lights.page.scss']
})
export class LightsPage implements AfterViewInit {
  refreshing: boolean = false;
  @ViewChild(IonReorderGroup, {static: true}) reorderGroup: IonReorderGroup;
  constructor(
    private navCtrl: NavController,
    public lightsService: LightsService
    ) {

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

  /**
   * Performs a refresh of the available/responsive devices
   * Unresponsive devices will be removed from the list
   */
  doRefresh(event) {
    this.refreshing = true;

    this.lightsService.refreshAll(1000)
    .then(
      (data) => {
        this.refreshing = false;
        event.target.complete();
      }
    ).catch(
      (error) => {
        this.refreshing = false;
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
}
