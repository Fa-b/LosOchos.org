import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private _storage: Storage) {

    console.log('Storage Service Initialised');
  }

  storeLocal(name: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._storage.ready().then(
        () => {
          return this._storage.set(name, data);
        })
        .then(
          (data) => {
            resolve(data);
          }).catch(
            (err) => {
              // this.events.publish('storage:error', err, Date.now());
              reject(err);
            });
    });
  }

  fetchLocal(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._storage.ready().then(
        () => {
          return this._storage.get(name);
        })
        .then(
          (data) => {
            resolve(data);
          }).catch(
            (err) => {
              // this.events.publish('storage:error', err, Date.now());
              reject(err);
            });
    });
  }
}
