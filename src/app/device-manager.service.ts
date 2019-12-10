import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceManagerService {

  constructor(public socket: WebsocketService) {

    this.attachSubscription();
    console.log('DeviceManager Service Initialized');
  }

    debugCommandAttach(value) {
      this.socket.send("debugCommandAttach", {name: value});
    }

  /* Subscribe to Device attachments */
  private attachSubscription() {
    this.socket.get('attach')
      .subscribe(
        (data) => {
            console.log("Device attached: " + JSON.stringify(data));
        },
        (err) => {
          console.log('Error during device attach: ', err, Date.now());
        },
        () => {
          // Notify that the device update subscription has closed
          console.log('Unsubscribed from device attach', Date.now());
        }
      );
  }
}
