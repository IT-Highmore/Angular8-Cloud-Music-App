import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WySliderHandleComponent } from './wy-slider-handle.component';
import { WySliderTrackComponent } from './wy-slider-track.component';
import { WySliderComponent } from './wy-slider.component';
@NgModule({
  declarations: [
    WySliderComponent,
    WySliderHandleComponent,
    WySliderTrackComponent,
  ],
  imports: [CommonModule],
  // tslint:disable-next-line:object-literal-sort-keys
  exports: [WySliderComponent],
})
export class WySliderModule {}
