import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { WyUiModule } from './wy-ui/wy-ui.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, NgZorroAntdModule, WyUiModule],
  // tslint:disable-next-line:object-literal-sort-keys
  exports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    WyUiModule,
  ],
})
export class ShareModule {}
