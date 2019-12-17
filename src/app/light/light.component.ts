import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LightDevice } from '../lights.service';



@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss'],
})
export class LightComponent implements OnInit {
  private _device: LightDevice;
  private changeCallback: (data: any) => void;

  @Input()
  get device() {
    return this._device;
  }
  set device(d: LightDevice){
      this._device = d;
  }

  @Output() detach: EventEmitter<LightDevice> = new EventEmitter<LightDevice>();
  @Output() viewInit: EventEmitter<LightDevice> = new EventEmitter<LightDevice>();
  constructor(private _ref: ChangeDetectorRef) {
    
  }

  ngOnInit() {
    this._device.on = (event, callback) => {
      if(event === 'change') {
        this.changeCallback = callback;
      }

      return this._device;
    };

    this.viewInit.emit(this._device);
  }

  onClick() {
    this.detach.emit(this._device);
  }

  onStateChange(event) {
    this.changeCallback({ on_state: this._device.on_state });
    // this.stateChange.emit(this._device);
  }

  onBrightnessChange(event) {
    this._device.brightness = event.detail.value;
    if(this._device.brightness > 0)
      this.device.on_state = true;
    else
      this.device.on_state = false;
      this.changeCallback({ brightness: this._device.brightness });
    // this.brightnessChange.emit(this._device);
  }
}
