import { Component, ViewChild } from '@angular/core';
import { LightComponent } from '../light/light.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page {
  // Typescript
  private arrayTest: LightComponent[];
  // kann aber muss nicht
  private iterator = 0;

  constructor() {
    // this.lights.push(new LightComponent());
    this.arrayTest = [];
  }

  onClick() {
    this.arrayTest.push(new LightComponent());
    this.iterator++;
  }

  newValue(e) {
    this.arrayTest.splice(e, 0, new LightComponent());
  }

}
// in der .ts ist typescript, in der html der zugehörige layout kram und in der css styling
// die komponenten müssen halt nur einmal gemacht werden