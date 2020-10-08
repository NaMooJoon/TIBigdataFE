import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntroRoutingModule } from './intro-routing.module';
import { IntroRootComponent } from './intro-root/intro-root.component';


@NgModule({
  declarations: [IntroRootComponent],
  imports: [
    CommonModule,
    IntroRoutingModule
  ]
})
export class IntroModule { }
