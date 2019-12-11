import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ILightDevice } from '../devices';

@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss'],
})
export class LightComponent implements OnInit {
  @Input() id:string;
  @Input() name:string;
  @Input() rgb:boolean;
  @Input() brightness:number;
  @Output() detach: EventEmitter<string> = new EventEmitter<string>();
  constructor() {

  }

  ngOnInit() {

  }

  onClick() {
    this.detach.emit(this.id);
  }
}
