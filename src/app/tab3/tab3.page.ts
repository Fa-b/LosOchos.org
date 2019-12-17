import { Component } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  private socketConfig = {
    address: "",
    port: ""
  };
  
  constructor(  public socket: WebsocketService,
                private storage: StorageService ) {

    this.storage.fetchLocal("socketConfig").then(
      (data) => {
        this.socketConfig.address = data.address;
        this.socketConfig.port = data.port;
        console.log("Fetched socket config", data);
      }
    ).catch(
      (error) => {
        this.socketConfig.address = "192.168.178.26";
        this.socketConfig.port = "8020";
        console.warn(error);
      });
    
  }

  onClick() {
    console.log("http://"+this.socketConfig.address+":"+this.socketConfig.port );

    this.storage.storeLocal("socketConfig", this.socketConfig).then(
      (data) => {
        console.log("Stored socket config", data);
      }
    ).catch(
      (error) => {
        console.warn(error);
      });

    this.socket.change("http://"+this.socketConfig.address+":"+this.socketConfig.port);
  }

}
