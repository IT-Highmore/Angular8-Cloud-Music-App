import { NgModule } from '@angular/core';
import { PlayCountPipe } from '../play-count.pipe';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';

@NgModule({
  declarations: [SingleSheetComponent, PlayCountPipe],
  imports: [],
  // tslint:disable-next-line:object-literal-sort-keys
  exports: [SingleSheetComponent, PlayCountPipe],
})
export class WyUiModule {}
