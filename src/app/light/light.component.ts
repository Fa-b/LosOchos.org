import { Component, Input } from '@angular/core';
import { LightsService } from '../lights.service';
import { LightDevice } from '../devices';



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
  set device(d: LightDevice){
      this._device = d;
  }

  // @Output() detach: EventEmitter<LightDevice> = new EventEmitter<LightDevice>();
  // @Output() viewInit: EventEmitter<LightDevice> = new EventEmitter<LightDevice>();
  constructor(private lightsService: LightsService) {
    
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

  onClick() {
    // this.detach.emit(this._device);
    this.lightsService.emit("detach", this._device, []);
  }

  onStateChange(event) {
    // console.log(event);
    this._device.on_state = event;//event.detail.checked;
    this.lightsService.emit("change", this._device, ["on_state"]);
  }

  onBrightnessChange(event) {
    // console.log(event);
    this._device.brightness = event;//event.detail.value;
    if(this._device.brightness > 0)
      this.device.on_state = true;
    else
      this.device.on_state = false;
      this.lightsService.emit("change", this._device, ["brightness"]);
  }
}
