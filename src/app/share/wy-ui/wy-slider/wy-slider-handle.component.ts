import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WySliderStyle } from './wy-slider-types';

@Component({
  selector: 'app-wy-slider-handle',
  template: `<div class="wy-slider-handle" [ngStyle]="style"></div>`,
  // tslint:disable-next-line:object-literal-sort-keys
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderHandleComponent implements OnInit, OnChanges {
  @Input() public wyVertical = false;
  @Input() public wyLength: number;
  public style: WySliderStyle = {};
  constructor() { }

  // tslint:disable-next-line:typedef
  public ngOnInit() {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.wyLength) {
      this.style[this.wyVertical ? 'bottom' : 'left'] = this.wyLength + '%';
    }
  }
}
