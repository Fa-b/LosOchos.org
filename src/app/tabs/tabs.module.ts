import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { DeviceConfigComponent } from '../device-config/device-config.component';
import { TextChangeComponent } from '../text-change/text-change.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  entryComponents: [
    DeviceConfigComponent,
    TextChangeComponent
  ],
  declarations: [
    TabsPage,
    DeviceConfigComponent,
    TextChangeComponent
  ]
})
export class TabsPageModule {}
