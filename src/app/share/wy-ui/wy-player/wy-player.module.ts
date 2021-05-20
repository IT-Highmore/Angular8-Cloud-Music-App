import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WyPlayerComponent } from './wy-player.component';

@NgModule({
  declarations: [WyPlayerComponent],
  imports: [CommonModule],
  // tslint:disable-next-line:object-literal-sort-keys
  exports: [WyPlayerComponent],
})
export class WyPlayerModule {}
