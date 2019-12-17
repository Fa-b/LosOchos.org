import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { IDevice } from './devices';
import { Dictionary } from "lodash";
import { Observable } from 'rxjs';
import { first, filter } from 'rxjs/operators';

export class Device implements IDevice {
  type: string;
  name: string;
  constructor(payload?: IDevice) {

    if(payload) {
      this.type = payload.type;
      this.name = payload.name;
    }
  }

  updateState(payload: IDevice) {
    this.type = payload.type;
    this.name = payload.name;
  }

}

@Injectable({
  providedIn: 'root'
})
export class DeviceManagerService {
  deviceDict: Dictionary<Device>
  dummyCounter: number;
  constructor(public socket: WebsocketService) {
    this.deviceDict = [];

    this.dummyCounter = 0;

    console.log('DeviceManager Service Initialized');
  }

  private deviceAttachment(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.get('attach')
        .subscribe(
          (data) => {
            if(data.hasOwnProperty("id")) {
              // Add new Device with empty type to dictionary
              this.deviceDict[data.id] = new Device();//"";//data.type;
              console.log('Subscribed for device publish on id: ', data.id);
              // Only take 'publish when id matches and also only take it once!
              this.socket.get('publish').pipe(filter(msg => msg.id === data.id), first())
                .subscribe(
                  (data) => {
                    console.log(data);
                    if(data.hasOwnProperty("payload")) {
                      this.deviceDict[data.id].updateState(data.payload);
                      // Notify subscribers only once!
                      observer.next(this.deviceDict[data.id]);
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
              let device = this.deviceDict[data.id];
              delete this.deviceDict[data.id];
              // Notify subscribers
              observer.next(device);
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
          (device) => {
            if(device.type === "Light") {
              console.log("LightDevice attached");
              listener(device);
            }
          },
          () => {
            console.warn('Unsubscribed from LightDevice attach', Date.now());
          }
        );
    } else if(event == 'lightDetach') {
      this.deviceDetachment()
      .subscribe(
        (device) => {
          if(device.type === "Light") {
            console.log("LighDevice detached");
            listener(device);
          }
        },
        () => {
          console.log('Unsubscribed from LightDevice detach', Date.now());
        }
      );
    }
  }

  set(device, data) {
    let id = Object.keys(this.deviceDict).find(element => this.deviceDict[element] === device);
    if(id) {
      this.socket.send("set", {
        id: id,
        payload: data
      });
    }
  }

  debugCommandAttach(value) {
    this.dummyCounter += 1;
    this.socket.send("debugCommandAttach", {name: "Dummy LED" + this.dummyCounter, type: value});
  }

  debugCommandDetach(device) {
    let id = Object.keys(this.deviceDict).find(element => this.deviceDict[element] === device);
    if(id) {
      this.socket.send("debugCommandDetach", {
        id: Object.keys(this.deviceDict).find(element => this.deviceDict[element] === device)
      });
    }
  }
}
