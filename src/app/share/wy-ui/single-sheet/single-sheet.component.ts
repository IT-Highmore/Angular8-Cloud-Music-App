import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SongSheet } from '../../../services/data-types/common.types';
@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSheetComponent implements OnInit {
  @Input() public sheet: SongSheet;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onPlay = new EventEmitter<Number>();
  constructor() {}

  public ngOnInit() {}

  // tslint:disable-next-line:typedef
  public playSheet(evt: MouseEvent, id: number) {
    console.log(1111);
    evt.stopPropagation();
    this.onPlay.emit(id);
  }
}
