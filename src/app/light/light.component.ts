import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LightsService } from '../lights.service';
import { LightDevice } from '../devices';
import { ModalController } from '@ionic/angular';
import { DeviceConfigComponent } from '../device-config/device-config.component';



@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss'],
})
export class LightComponent {
  public _device: LightDevice;

  // private changeCallback: (data: any) => void = () => {};
  @Input()
  get device() {
    return this._device;
  }
  set device(d: LightDevice) {
    this._device = d;
  }

  @Input() disabled: boolean;

  @Output() sticky: EventEmitter<LightDevice> = new EventEmitter<LightDevice>();
  constructor(
    private modalController: ModalController,
    private lightsService: LightsService
  ) {

  }

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
   * - Change Name (emit onNameChange(newName))
   * - ...
   *
   * */
  async onConfig(item) {
    item.close();
    console.log(this._device);
    // ModalComponent needs a module and this needs to be known by LightComponents Module
    const modal = await this.modalController.create({
      component: DeviceConfigComponent,
      componentProps: {
        'device': this._device,
        'change': this.onDefaultChange
      }
    });
    return await modal.present();
  }

  onDefaultChange = (event) => {
    if(event.length != 0)
      this.lightsService.emit("store", this._device, event);
  }

  onStateChange = (event) => {
    // console.log(event);
    this._device.on_state = event.detail.checked;
    this.lightsService.emit("change", this._device, ["on_state"]);
  }

  onBrightnessChange = (event) => {
    // console.log(event);
    this._device.brightness = event;//event.detail.value;
    if (this._device.brightness > 0)
      this.device.on_state = true;
    else
      this.device.on_state = false;
    this.lightsService.emit("change", this._device, ["brightness"]);
  }
}
