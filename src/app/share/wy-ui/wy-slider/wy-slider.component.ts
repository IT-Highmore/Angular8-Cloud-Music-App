import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, forwardRef, OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, takeUntil, tap } from 'rxjs/internal/operators';
import { inArray } from 'src/app/utils/array';
import { getPercent, limitNumberInRange } from 'src/app/utils/number';
import { getElementOffset, sliderEvent } from './wy-slider-helper';
import { SliderEventObserverConfig, SliderValue } from './wy-slider-types';
@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  // tslint:disable-next-line:object-literal-sort-keys
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // 自定义表单控件,注入token
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WySliderComponent),
    // tslint:disable-next-line:object-literal-sort-keys
    multi: true,
  }],
})
export class WySliderComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() public wyVertical: false;
  @Input() public wyMin = 0;
  @Input() public wyMax = 100;
  @Input() public bufferOffset: SliderValue = 0;

  private sliderDom: HTMLDivElement;
  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;

  // 绑定流
  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  // 取消订阅
  // tslint:disable-next-line:variable-name
  private dragStart_: Subscription | null;
  // tslint:disable-next-line:variable-name
  private dragMove_: Subscription | null;
  // tslint:disable-next-line:variable-name
  private dragEnd_: Subscription | null;

  private isDragging = false;
  private value: SliderValue = null;
  public offset: SliderValue = null;

  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private doc: Document,
    private cdr: ChangeDetectorRef,
  ) {}

  // tslint:disable-next-line:typedef
  public ngOnInit() {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
  }

  public ngOnDestroy(): void {
    this.unsubscribeDrag();
  }

  // tslint:disable-next-line:typedef
  private createDraggingObservables() {
    const orientField = this.wyVertical ? 'pageY' : 'pageX';
    // pc mousedown mousemove mouseup
    // phone touchstart touchmove touchend
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      // tslint:disable-next-line:object-literal-sort-keys
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey: [orientField],
    };
    const touch: SliderEventObserverConfig = {
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
        map((position: number) => this.findCloseValue(position)),
      );

      source.end$ = fromEvent(this.doc, end);
      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(filerFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findCloseValue(position)),
        takeUntil(source.end$),
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
    const ratio = limitNumberInRange(
      (position - sliderStart) / sliderLength, 0, 1);
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

  // tslint:disable-next-line:typedef
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

  // tslint:disable-next-line:typedef
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

  // tslint:disable-next-line:typedef
  private onDragStart(value: number) {
    this.toggleDragMoving(true);
    this.setValue(value);
  }
  // tslint:disable-next-line:typedef
  private toggleDragMoving(movable: boolean) {
    if (movable) {
      this.isDragging = movable;
      this.subscribeDrag(['move', 'end']);
    } else {
      this.unsubscribeDrag(['move', 'end']);
    }
  }
  // tslint:disable-next-line:typedef
  private onDragMove(value: number) {
    if (this.isDragging) {
      this.setValue(value);
      this.cdr.markForCheck(); // 手动变更检测
    }
  }
  // tslint:disable-next-line:typedef
  private onDragEnd() {
    // this.wyOnAfterChange.emit(this.value);
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }

  // tslint:disable-next-line:typedef
  private setValue(value: SliderValue, needCheck = false) {
    // 判断是否需要一次检测
    if (needCheck) {
      if (this.isDragging) {
        return;
      }
      // 把不合法值变成合法值
      this.value = this.formatValue(value);
      this.updateTrackAndHandles();
      // 判断如果相等的话不执行
    } else if (!this.valuesEqual(this.value, value)) {
      this.value = value;
      this.updateTrackAndHandles();
      this.onValueChange(this.value);
    }
  }
  // tslint:disable-next-line:typedef
  private valuesEqual(valueA: SliderValue, valueB: SliderValue) {
    if (typeof valueA !== typeof valueB) {
      return false;
    } else {
      return valueA === valueB;
    }
  }
  private onValueChange(value: SliderValue): void {
    throw new Error('Method not implemented.');
  }
  private onTouched(): void {

  }
  private updateTrackAndHandles() {
    this.offset = this.getValueToOffset(this.value);
    this.cdr.markForCheck();
  }
  private getValueToOffset(value: SliderValue): SliderValue {
    return getPercent(this.wyMin, this.wyMax, value);
  }

  private formatValue(value: SliderValue): SliderValue {
    let res = value;
    // 判断是否为数字
    if (this.assertValueValid(value)) {
      res = this.wyMin;
    } else {
      res = limitNumberInRange(value, this.wyMin, this.wyMax);
    }
    return res;
  }
  private assertValueValid(value: SliderValue): boolean {
    return isNaN(typeof value !== 'number' ? parseFloat(value) : value);
  }

  // 赋值
  public writeValue(value: SliderValue): void {
    // 读值赋值
    this.setValue(value, true);
  }
  // 发送change事件
  public registerOnChange(fn: (value: SliderValue) => void): void {
    this.onValueChange = fn;
  }
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
