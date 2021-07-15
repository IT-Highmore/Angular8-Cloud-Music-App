import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, takeUntil, tap } from 'rxjs/internal/operators';
import { inArray } from 'src/app/utils/array';
import { limitNumberInRange } from 'src/app/utils/number';
import { getElementOffset, sliderEvent } from './wy-slider-helper';
@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  // tslint:disable-next-line:object-literal-sort-keys
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderComponent implements OnInit {
  @Input() public wyVertical: false;
  @Input() public wyMin = 0;
  @Input() public wyMax = 100;

  private sliderDom: HTMLDivElement;
  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;
  // tslint:disable-next-line:variable-name
  private dragStart_: Subscription | null;
  // tslint:disable-next-line:variable-name
  private dragMove_: Subscription | null;
  // tslint:disable-next-line:variable-name
  private dragEnd_: Subscription | null;

  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  // tslint:disable-next-line:typedef
  public ngOnInit() {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
  }

  // tslint:disable-next-line:typedef
  private createDraggingObservables() {
    const orientField = this.wyVertical ? 'pageY' : 'pageX';
    // pc mousedown mousemove mouseup
    // phone touchstart touchmove touchend
    const mouse = {
      start: 'mousedown',
      // tslint:disable-next-line:object-literal-sort-keys
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey: [orientField],
    };
    const touch = {
      start: 'touchstart',
      // tslint:disable-next-line:object-literal-sort-keys
      move: 'touchmove',
      end: 'touchend',
      filter: (e: TouchEvent) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField],
    };
    [mouse, touch].forEach((source) => {
      const { start, move, end, filter: filerFunc, pluckKey } = source;

      source.startPlucked$ = fromEvent(this.sliderDom, start).pipe(
        filter(filerFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        map((position: number) => this.findCloseValue(position))
      );

      source.end$ = fromEvent(this.doc, end);
      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(filerFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findCloseValue(position)),
        takeUntil(source.end$)
      );

      this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
      this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
      this.dragEnd$ = merge(mouse.end$, touch.end$);
    });
  }

  public findCloseValue(position: number): number {
    // 获取滑块总长
    const sliderLength = this.getSliderLength();

    // 获取滑块(左，上)端点位置
    const sliderStart = this.getSliderStart();

    // 滑块当前位置/滑块总长
    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    const radioTrue = this.wyVertical ? 1 - ratio : ratio;
    return radioTrue * (this.wyMax - this.wyMin) + this.wyMin;
  }
  private getSliderLength(): number {
    return this.wyVertical
      ? this.sliderDom.clientHeight
      : this.sliderDom.clientWidth;
  }

  private getSliderStart(): number {
    const offset = getElementOffset(this.sliderDom);
    return this.wyVertical ? offset.top : offset.left;
  }

  private subscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart$ && !this.dragStart_) {
      this.dragStart_ = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'move') && this.dragMove$ && !this.dragMove_) {
      this.dragMove_ = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArray(events, 'end') && this.dragEnd$ && !this.dragEnd_) {
      this.dragEnd_ = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private unsubscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart_) {
      this.dragStart_.unsubscribe();
      this.dragStart_ = null;
    }
    if (inArray(events, 'move') && this.dragMove_) {
      this.dragMove_.unsubscribe();
      this.dragMove_ = null;
    }
    if (inArray(events, 'end') && this.dragEnd_) {
      this.dragEnd_.unsubscribe();
      this.dragEnd_ = null;
    }
  }

  private onDragStart(value: number) {
    console.log(value);
    // this.toggleDragMoving(true);
    // this.setValue(value);
  }
  private onDragMove(value: number) {
    if (this.isDragging) {
      this.setValue(value);
      this.cdr.markForCheck();
    }
  }
  private onDragEnd() {
    this.wyOnAfterChange.emit(this.value);
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }

  private setValue(value: SliderValue, needCheck = false) {
    if (needCheck) {
      if (this.isDragging) {
        return;
      }
      this.value = this.formatValue(value);
      this.updateTrackAndHandles();
    } else if (!this.valuesEqual(this.value, value)) {
      this.value = value;
      this.updateTrackAndHandles();
      this.onValueChange(this.value);
    }
  }

  private formatValue(value: SliderValue): SliderValue {
    let res = value;
    if (this.assertValueValid(value)) {
      res = this.wyMin;
    } else {
      res = limitNumberInRange(value, this.wyMin, this.wyMax);
    }
    return res;
  }
}
