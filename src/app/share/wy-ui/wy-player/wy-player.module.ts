import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormatTimePipe } from '../../pipes/format-time.pipe';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import { WyPlayerComponent } from './wy-player.component';

@NgModule({
  declarations: [WyPlayerComponent, FormatTimePipe],
  imports: [CommonModule, WySliderModule, FormsModule],
  // tslint:disable-next-line:object-literal-sort-keys
  exports: [WyPlayerComponent, FormatTimePipe],
})
export class WyPlayerModule {}
