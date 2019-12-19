import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Dictionary } from "lodash";
import { Observable } from 'rxjs';
import { first, filter } from 'rxjs/operators';
import { BaseDevice, LightDevice, ILightDevice, IDevice } from './devices';


@Injectable({
  providedIn: 'root'
})
export class DeviceManagerService {
  deviceDict: Dictionary<IDevice>
  dummyCounter: number;
  constructor(public socket: WebsocketService) {
    this.deviceDict = [];

    this.dummyCounter = 0;

    console.log('DeviceManager Service Initialized');
  }

  private deviceAttachment(): Observable<BaseDevice> {
    return Observable.create((observer) => {
      this.socket.get('attach')
        .subscribe(
          (data) => {
            if (data.hasOwnProperty("id")) {
              // Add new Device with empty type to dictionary
              // this.deviceDict[data.id] = new BaseDevice();//"";//data.type;
              console.log('Subscribed for device publish on id: ', data.id);
              // Only take 'publish when id matches and also only take it once!
              this.socket.get('publish').pipe(filter(msg => msg.id === data.id), first())
                .subscribe(
                  (data) => {
                    // console.log(data);
                    // received publish, have to route the correct type to create instance!
                    if (data.hasOwnProperty("payload") && data.payload.type === "Light" ) {
                      // Add new LightDevice to dictionary
                      this.deviceDict[data.id] = new LightDevice();
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

  private deviceResponse(): Observable<IDevice> {
    return Observable.create((observer) => {
      this.socket.get('set')
        .subscribe(
          (data) => {
            if (data.hasOwnProperty("id") && data.hasOwnProperty("payload")) {
              // If valid: notify subscribers
              // this.deviceDict[data.id] = <T>this.deviceDict[data.id];
              this.deviceDict[data.id].updateState(data.payload);
              observer.next(this.deviceDict[data.id]);
            }
          },
          (err) => {
            console.error('Error during device set response: ', err, Date.now());
          },
          () => {
            console.warn('Unsubscribed from device set response', Date.now());
          }
        );
        this.socket.get('get')
        .subscribe(
          (data) => {
            if (data.hasOwnProperty("id") && data.hasOwnProperty("payload")) {
              // If valid: notify subscribers
              // this.deviceDict[data.id] = <T>this.deviceDict[data.id];
              this.deviceDict[data.id].updateState(data.payload);
              observer.next(this.deviceDict[data.id]);
            }
          },
          (err) => {
            console.error('Error during device set response: ', err, Date.now());
          },
          () => {
            console.warn('Unsubscribed from device set response', Date.now());
          }
        );
    });
  }

  private deviceDetachment(): Observable<BaseDevice> {
    return Observable.create((observer) => {
      this.socket.get('detach')
        .subscribe(
          (data) => {
            if (data.hasOwnProperty("id")) {
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
    if (event == 'lightAttach') {
      this.deviceAttachment()
        .subscribe(
          (device) => {
            if (device.type === "Light") {
              console.log("LightDevice attached");
              
              listener(device);
            }
          },
          () => {
            console.warn('Unsubscribed from LightDevice attach', Date.now());
          }
        );
    } else if (event == 'lightResponse') {
      this.deviceResponse()
        .subscribe(
          (device) => {
              console.log("LightDevice response");
              // console.log(device);
              listener(device);
          },
          () => {
            console.warn('Unsubscribed from LightDevice response', Date.now());
          }
        );
    } else if (event == 'lightDetach') {
      this.deviceDetachment()
        .subscribe(
          (device) => {
            if (device.type === "Light") {
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
    if (id) {
      this.socket.send("set", {
        id: id,
        payload: data
      });
    }
  }

  get(device, data) {
    let id = Object.keys(this.deviceDict).find(element => this.deviceDict[element] === device);
    if (id) {
      this.socket.send("get", {
        id: id,
        payload: data
      });
    }
  }

  refreshList(timeout: number): Observable<any> {
    let refreshList = {};

    return new Observable((observer) => {
      this.socket.get('get')
      .subscribe(
        (data) => {
        if (data.hasOwnProperty("id")) {
          // We only keep devices that we will have to kill from gui
          delete refreshList[data.id];
        }
  
        // If this is the case, all our ids responded :)
        if(Object.keys(refreshList).length === 0) {
          observer.complete();
        }
      });
  
      // request a get package for all devices and all properties on them
      for(let id in this.deviceDict) {
        refreshList[id] = this.deviceDict[id];
        this.get(this.deviceDict[id], this.deviceDict[id]);
      }
  
  
      setTimeout(() => {
        // OK, some of our devices are not responding,
        // so we should clear them from our list!
        for(let id in refreshList) {
          if(this.deviceDict[id]) {
            // start removing them here:
            delete this.deviceDict[id];
            // Then send its residing instance to subscriber
            observer.next(refreshList[id]);
          } else {
            delete refreshList[id];
            console.log("Oops, detached itself :-)");
          } 
        }
        // Then complete
        observer.complete();
      }, timeout);
    });
  }

  debugCommandAttach(value) {
    this.dummyCounter += 1;
    this.socket.send("debugCommandAttach", { name: "Dummy LED" + this.dummyCounter, type: value });
  }

  debugCommandDetach(device) {
    let id = Object.keys(this.deviceDict).find(element => this.deviceDict[element] === device);
    if (id) {
      this.socket.send("debugCommandDetach", {
        id: Object.keys(this.deviceDict).find(element => this.deviceDict[element] === device)
      });
    }
  }
}
