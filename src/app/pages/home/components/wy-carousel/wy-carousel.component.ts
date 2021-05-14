import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // 其他组件更新不会影响该组件检测刷新，变更检测
})
export class WyCarouselComponent implements OnInit {
  @Input() activeIndex = 0;

  @Output() changeSlide = new EventEmitter<'pre' | 'next'>();

  @ViewChild('dot', { static: true })
  dotRef: TemplateRef<any>;
  constructor() {}

  ngOnInit() {}

  onChangeSlide(type: 'pre' | 'next') {
    this.changeSlide.emit(type);
  }
}
