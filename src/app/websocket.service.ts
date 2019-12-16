import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';




@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
    private socket;

    constructor(
      public http: HttpClient) {
  
      this.socket = io("http://localhost:8020");
  
      console.log('WebSocket Service Initialized');
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
