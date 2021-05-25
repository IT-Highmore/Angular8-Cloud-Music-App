import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  // tslint:disable-next-line:object-literal-sort-keys
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class WySliderComponent implements OnInit {
  private sliderDom: HTMLDivElement;
  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;
  constructor(private el: ElementRef) {}

  // tslint:disable-next-line:typedef
  public ngOnInit() {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
  }

  // tslint:disable-next-line:typedef
  private createDraggingObservables() {
    // pc mousedown mousemove mouseup
    // phone touchstart touchmove touchend
    const mouse = {
      start: 'mousedown',
      // tslint:disable-next-line:object-literal-sort-keys
      move: 'mousemove',
      end: 'mouseup',
    };
    const touch = {
      start: 'touchstart',
      // tslint:disable-next-line:object-literal-sort-keys
      move: 'touchmove',
      end: 'touchend',
    };

  }
}
