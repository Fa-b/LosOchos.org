import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-text-change',
  templateUrl: './text-change.component.html',
  styleUrls: ['./text-change.component.scss'],
})
export class TextChangeComponent implements OnInit {
  private text: string;
  // @Input()
  // get text() {
  //   return this._text;
  // }
  // set text(t: string) {
  //   this._text = t;
  // }
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  onConfirm() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
      'text': this.text
    });
  }

  onDismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
