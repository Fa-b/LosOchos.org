import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ILightDevice } from '../devices';
import { Device } from '../device-manager.service';

class LightDevice extends Device implements ILightDevice {
  rgb: boolean;
  brightness: number;
  on_state: boolean;
  constructor(id: string, type: string, name?: string, on_state?: boolean, brightness?: number, rgb?: boolean) {
    super(id, type, name);

    this.on_state = on_state;
    this.brightness = brightness;
    this.rgb = rgb;
  }
}

@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss'],
})
export class LightComponent implements OnInit {
  private _device: LightDevice;

  @Input()
  get device() {
    return this._device;
  }
  set device(d: LightDevice){
    // Official bug fix see GitHub:
    // https://github.com/ionic-team/ionic/issues/17830
    setTimeout(() => {
      this._device = d;
    }, 0);
  }
  @Output() detach: EventEmitter<string> = new EventEmitter<string>();
  @Output() change: EventEmitter<Device> = new EventEmitter<Device>();
  constructor(private _ref: ChangeDetectorRef) {

  }

  ngOnInit() {

  }

  onClick() {
    this.detach.emit(this._device.id);
  }

  onStateChange(event) {
    this.change.emit(this._device);
  }

  onBrightnessChange(event) {
    this._device.brightness = event.detail.value;
    this.device.on_state = true;
    this.change.emit(this._device);
  }
}
