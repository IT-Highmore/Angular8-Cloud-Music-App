import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import { WyPlayerComponent } from './wy-player.component';

@NgModule({
  declarations: [WyPlayerComponent],
  imports: [CommonModule, WySliderModule, FormsModule],
  // tslint:disable-next-line:object-literal-sort-keys
  exports: [WyPlayerComponent],
})
export class WyPlayerModule {}
