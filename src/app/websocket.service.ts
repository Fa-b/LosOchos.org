import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { StorageService } from './storage.service';


export interface ISocketConfig {
  address: string,
  port: string
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socketConfig: ISocketConfig = {
    address: "",
    port: ""
  };
  private socket = io({
    autoConnect: false,
    path: "/LosOchos.org/socket.io"
  });

  private changeCallback: (config: ISocketConfig) => void = () => {};

  on: (event: string | symbol, listener: (...args: any[]) => void) => WebsocketService;
  
  constructor(
    private storage: StorageService
  ) {

    this.storage.fetchLocal("socketConfig").then(
      (data) => {
        return this.validateConfig(data);
      }).then((data) => {
        this.socketConfig.address = data.address;
        this.socketConfig.port = data.port;
        console.log("Fetched socket config", data);
        this.update();
      }).catch(
        (error) => {
          this.socketConfig.address = "0.0.0.0";
          this.socketConfig.port = "8020";
          console.warn(error);
          // Todo: show config tab
        });

    this.on = (event, callback) => {
      if(event === 'change') {
        this.changeCallback = callback;
      }

      return this;
    };

    console.log('WebSocket Service Initialized');
  }

  getConfig(): ISocketConfig {
    return this.socketConfig;
  }

  change(config: ISocketConfig) {
    this.validateConfig(config).then(
      (data) => {
        return this.storage.storeLocal("socketConfig", data);
      })
      .then(
        (data) => {
          this.socketConfig.address = data.address;
          this.socketConfig.port = data.port;
          console.log("Stored socket config", data);
          this.update();
        }
      ).catch(
        (error) => {
          console.warn(error);
        });
  }

  /**
   * Checks if the given config is valid
   */
  validateConfig(config: ISocketConfig): Promise<ISocketConfig> {
    return new Promise((resolve, reject) => {
      if (config && config.address && config.port)
        resolve(config);
      else
        reject("Invalid input");
    });
  }

  update() {
    let address = "http://" + this.socketConfig.address + ":" + this.socketConfig.port;
    console.log("Connecting to socket", address);
    this.socket.io.uri = address;
    this.socket.connect();
    this.changeCallback(this.socketConfig);
  }

  send(route: string,
    params?: HttpParams | {
      [param: string]: string | string[];
    }) {
    this.socket.emit(route, params);
  }

  get(
    route: string,
    params?: HttpParams | {
      [param: string]: string | string[];
    }): Observable<any> {

    return Observable.create((observer) => {
      this.socket.on(route,
        (data) => {
          if (data.hasOwnProperty('device')) {
            observer.next(data.device);
          }/* else if(data.hasOwnProperty('id')) {
              observer.next(JSON.parse((<any>data).id.toString()));
            } else if(data.hasOwnProperty('message')) {
              observer.next(JSON.parse((<any>data).message.toString()));
            } else if (data.hasOwnProperty('error')) {
              observer.error(JSON.parse((<any>data).error.toString()));
            }*/ else {
            console.log(data);
            observer.error("Invalid response");
          }
        }
      );
    });
  }
}
