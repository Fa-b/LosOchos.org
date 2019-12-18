import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page implements AfterViewInit {


  constructor() {

  }

  ngAfterViewInit() {
    console.log("Here comes the home tab...");
  }

}
// in der .ts ist typescript, in der html der zugehörige layout kram und in der css styling
// die komponenten müssen halt nur einmal gemacht werden