import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { IDevice } from './devices';
import { Dictionary } from "lodash";
import { Observable } from 'rxjs';

export class Device implements IDevice {
  type: string;
  name: string;
  id: string;
  constructor(id: string, type: string, name?: string) {
    this.id = id;
    this.type = type;
    this.name = name;
  }

  static hasInstance(object: any): object is Device {
    return object.hasOwnProperty("id") && object.hasOwnProperty("type");
  }
}

@Injectable({
  providedIn: 'root'
})
export class DeviceManagerService {
  deviceDict: Dictionary<string>
  constructor(public socket: WebsocketService) {
    this.deviceDict = [];

    console.log('DeviceManager Service Initialized');
  }

  private deviceAttachment(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.get('attach')
        .subscribe(
          (data) => {
            if(Device.hasInstance(data)) {
              // Add new Device to dictionary
              this.deviceDict[data.id] = data.type;
              // Notify subscribers
              observer.next(data);
            }
          },
          (err) => {
            console.error('Error during device attachment: ', err, Date.now());
          },
          () => {
            console.warn('Unsubscribed from device attachments', Date.now());
          }
        );
      });
  }

  private deviceDetachment(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.get('detach')
        .subscribe(
          (data) => {
            if(data.hasOwnProperty('id')) {
              let type = this.deviceDict[data.id];
              // Fetch type and remove Device from dictionary
              delete this.deviceDict[data.id];
              // Notify subscribers
              observer.next({ id: data.id, type: type });
            }
          },
          (err) => {
            console.error('Error during device detachment: ', err, Date.now());
          },
          () => {
            console.warn('Unsubscribed from device detachments', Date.now());
          }
        );
      });
  }

  on(event: string | symbol, listener: (...args: any[]) => void) {
    if(event == 'lightAttach') {
      this.deviceAttachment()
        .subscribe(
          (data) => {
            if(data.type === "Light") {
              console.log("LighDevice attached");
              listener(data);
            }
          },
          () => {
            console.warn('Unsubscribed from LightDevice attach', Date.now());
          }
        );
    } else if(event == 'lightDetach') {
      this.deviceDetachment()
      .subscribe(
        (data) => {
          if(data.type === "Light") {
            console.log("LighDevice detached");
            listener(data);
          }
        },
        () => {
          console.log('Unsubscribed from LightDevice detach', Date.now());
        }
      );
    }
  }

  set(data) {
    this.socket.send("set", data);
  }

  debugCommandAttach(value) {
    this.socket.send("debugCommandAttach", {name: value});
  }

  debugCommandDetach(value) {
    this.socket.send("debugCommandDetach", {id: value});
  }
}
