import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NavParams, ModalController, NavController, IonInput } from '@ionic/angular';
import { LightDevice } from '../devices';
import { TextChangeComponent } from '../text-change/text-change.component';

@Component({
  selector: 'app-device-config',
  templateUrl: './device-config.component.html',
  styleUrls: ['./device-config.component.scss'],
})
export class DeviceConfigComponent implements OnInit {
  private device: LightDevice;
  private change: (string) => void;
  // @Input()
  // get device() {
  //   return this._device;
  // }
  // set device(d: LightDevice) {
  //   this._device = d;
  // }
  
  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalController: ModalController) {
      
    }

  ngOnInit() { }

  onConfirm() {
    
    let retVal = [];

    if(this.device.brightness != this.device.defaults.brightness)
      retVal.push("brightness");
    if(this.device.on_state != this.device.defaults.on_state)
      retVal.push("on_state");
    this.change(retVal);
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  onDismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async editName() {
    const modal = await this.modalController.create({
      component: TextChangeComponent,
      componentProps: {
        'title': "Change Name",
        'text': this.device.name
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        let name = data.data['text'];
        if(name != this.device.name) {
          this.device.name = name;
          this.change(["name"]);
        }
    });

    return await modal.present();
  }

}
