import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebsocketService } from './websocket.service';
import { DeviceManagerService } from './device-manager.service';
import { HttpClientModule } from '@angular/common/http';
import { LightsService } from './lights.service';

export function LightsServiceFactory(provider: LightsService) {
  return () => provider.load();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [ ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    WebsocketService,
    DeviceManagerService,
    { provide: APP_INITIALIZER, useFactory: LightsServiceFactory, deps: [LightsService], multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
