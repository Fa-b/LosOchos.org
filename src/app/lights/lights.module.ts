import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LightsPage } from './lights.page';
import { LightComponent } from '../light/light.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: LightsPage }])
  ],
  declarations: [
    LightsPage,
    LightComponent
  ],
    exports: [
      LightComponent
    ]
})
export class LightsPageModule {}
