import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss'],
})
export class LightComponent implements OnInit {
  @Input() value:number;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();
  private name: string = "LED ";
  constructor() {

  }

  // constructor wird schon vorher aufgerufen glaube ich
  ngOnInit() {

  }

  onClick() {
    this.value++;

    this.valueChange.emit(this.value);
  }
}
