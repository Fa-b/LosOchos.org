import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ILightDevice } from '../devices';
import { Device } from '../device-manager.service';

class LightDevice extends Device implements ILightDevice {
  rgb: boolean;
  brightness: number;
  constructor(id: string, type: string, name?: string) {
    super(id, type, name);
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
    this._device = d;
  }
  @Output() detach: EventEmitter<string> = new EventEmitter<string>();
  rgb: boolean;
  brightness: number;
  constructor() {

  }

  ngOnInit() {

  }

  onClick() {
    this.detach.emit(this.device.id);
  }
}
