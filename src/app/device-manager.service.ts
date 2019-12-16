import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { IDevice } from './devices';
import { Dictionary } from "lodash";
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

export class Device implements IDevice {
  id: string;
  type: string;
  name: string;
  
  constructor(id: string, payload: IDevice) {
    this.id = id;
    this.type = payload.type;
    this.name = payload.name;
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
            if(data.hasOwnProperty("id")) {
              // Add new Device with empty type to dictionary
              this.deviceDict[data.id] = "";//data.type;
              console.log('Subscribed for device publish on id: ', data.id);
              this.socket.get('publish').pipe(first())
                .subscribe(
                  (data) => {
                    console.log(data);
                    if(data.hasOwnProperty("payload")) {
                      this.deviceDict[data.id] = data.payload;
                      // Notify subscribers
                      observer.next(data);
                    }
                  },
                  (err) => {
                    console.error('Error during device publish: ', err, Date.now());
                  },
                  () => {
                    console.warn('Unsubscribed from device publish', Date.now());
                  }
                );
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
            if(data.hasOwnProperty("id")) {
              let payload = this.deviceDict[data.id];
              delete this.deviceDict[data.id];
              // Notify subscribers
              observer.next({ id: data.id, payload: payload });
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
            if(data.payload.type === "Light") {
              console.log("LightDevice attached");
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
          if(data.payload.type === "Light") {
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
