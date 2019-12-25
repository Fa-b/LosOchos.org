import { Component, AfterViewInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements AfterViewInit {
  public address: string;
  public port: string;

  constructor(
    private navCtrl: NavController,
    public socket: WebsocketService
  ) {
    this.address = socket.getConfig().address;
    this.port = socket.getConfig().port;

    this.socket.on("change", function(data) {
      this.address = data.address;
      this.port = data.port;
    });
  }

  ngAfterViewInit() {
    console.log("Here comes the config tab...");
  }

  onClick() {
    this.socket.change({address: this.address, port: this.port});
  }
    

}
