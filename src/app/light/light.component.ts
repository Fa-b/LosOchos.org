import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ILightDevice } from '../devices';
import { Device } from '../device-manager.service';

class LightDevice extends Device implements ILightDevice {
  rgb: boolean;
  brightness: number;
  on_state: boolean;
  constructor(id: string, type: string, name?: string, on_state?: boolean) {
    super(id, type, name);

    this.on_state = on_state;
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
    console.log("setting instance")
    console.log(d);
    this._device = d;
    
  }
  @Output() detach: EventEmitter<string> = new EventEmitter<string>();
  rgb: boolean;
  brightness: number;
  constructor(private _ref: ChangeDetectorRef) {
    console.log("constructing component")
    console.log(this._device);
  }

  ngOnInit() {
    console.log("ng init")
    console.log(this._device);
  }

  onClick() {
    this.detach.emit(this.device.id);
  }

  onBrightnessChange(event) {
    this.device.on_state = true;
  }
}
