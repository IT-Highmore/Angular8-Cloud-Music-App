import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { WySliderStyle } from './wy-slider-types';

@Component({
  selector: 'app-wy-slider-track',
  template: `<div class="wy-slider-track" [ngStyle]="style"></div>`,
  // tslint:disable-next-line:object-literal-sort-keys
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderTrackComponent implements OnInit {
  @Input() public wyVertical = false;
  @Input() public wyLength: number;
  public style: WySliderStyle = {};
  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.wyOffset) {
      if (this.wyVertical) {
        this.style.height = this.wyLength + '%';
        this.style.left = null;
        this.style.width = null;
      } else {
        this.style.width = this.wyLength + '%';
        this.style.left = null;
        this.style.height = null;
      }
    }
  }
}
