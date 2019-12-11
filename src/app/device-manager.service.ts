import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { ILightDevice } from './devices';
import { Dictionary } from "lodash";

export class LightDevice implements ILightDevice {
  type: string;
  name: string;
  id: string;
  rgb: boolean;
  brightness: number;
  constructor(type: string, name: string, id: string) {
    this.type = type;
    this.name = name;
    this.id = id;
  }

  static instanceOf(object: any): object is ILightDevice {
    return object.type === "Light";
  }
}

@Injectable({
  providedIn: 'root'
})
export class DeviceManagerService {
  deviceDict: Dictionary<string>
  constructor(public socket: WebsocketService) {
    this.deviceDict = [];
    this.socket.get('attach')
      .subscribe(
        (data) => {
          if(data.hasOwnProperty('id') && data.hasOwnProperty('type')) {
            this.deviceDict[data.id] = data.type;
          }
        },
        (err) => {
          console.log('Error during device attachment: ', err, Date.now());
        },
        () => {
          console.log('Unsubscribed from device attachments', Date.now());
        }
      );

    console.log('DeviceManager Service Initialized');
  }

  on(event: string | symbol, listener: (...args: any[]) => void) {
    if(event == 'lightAttach') {
      this.socket.get('attach')
      .subscribe(
        (data) => {
          if(LightDevice.instanceOf(data)) {
            console.log("LighDevice attached");
            listener(data);
          }
        },
        () => {
          console.log('Unsubscribed from LightDevice attach', Date.now());
        }
      );
    } else if(event == 'lightDetach') {
      this.socket.get('detach')
      .subscribe(
        (data) => {
          if(data.hasOwnProperty('id')) {
            if(this.deviceDict[data.id]) {
              listener(data.id);
            }
          }
          
        },
        () => {
          console.log('Unsubscribed from LightDevice detach', Date.now());
        }
      );
    }
  }

  debugCommandAttach(value) {
    this.socket.send("debugCommandAttach", {name: value});
  }

  debugCommandDetach(value) {
    console.log(value);
    this.socket.send("debugCommandDetach", {id: value});
  }
}
