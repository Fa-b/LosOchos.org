import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LightsService } from '../lights.service';
import { LightDevice } from '../devices';
import { async } from 'q';
import { ActionSheetController } from '@ionic/angular';



@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss'],
})
export class LightComponent {
  private _device: LightDevice;

  // private changeCallback: (data: any) => void = () => {};
  @Input()
  get device() {
    return this._device;
  }
  set device(d: LightDevice) {
    this._device = d;
  }

  @Input() disabled:boolean;

  @Output() sticky: EventEmitter<LightDevice> = new EventEmitter<LightDevice>();
  constructor(
    private actionSheetController: ActionSheetController,
    private lightsService: LightsService
  ) {

  }

  // ngOnInit() {

  //   this._device.on = (event, callback) => {
  //     if(event === 'change') {
  //       // this.changeCallback = callback;
  //     }

  //     return this._device;
  //   };

  //   this.viewInit.emit(this._device);
  // }

  onDetach(item) {
    item.close();
    // this.detach.emit(this._device);
    this.lightsService.emit("detach", this._device, []);
  }

  onSticky(item) {
    item.close();
    this.sticky.emit(this._device);
  }

  /** Todo:
   * - Change Name
   * - ...
   *
   * */
  async onConfig(item) {
    item.close();
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  onStateChange(event) {
    // console.log(event);
    this._device.on_state = event.detail.checked;
    this.lightsService.emit("change", this._device, ["on_state"]);
  }

  onBrightnessChange(event) {
    // console.log(event);
    this._device.brightness = event;//event.detail.value;
    if (this._device.brightness > 0)
      this.device.on_state = true;
    else
      this.device.on_state = false;
    this.lightsService.emit("change", this._device, ["brightness"]);
  }
}
