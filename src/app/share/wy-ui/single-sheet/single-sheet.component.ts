import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SongSheet } from '../../../services/data-types/common.types';
@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  // tslint:disable-next-line:object-literal-sort-keys
  styleUrls: ['./single-sheet.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSheetComponent implements OnInit {
  @Input() public sheet: SongSheet;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onPlay = new EventEmitter<number>();
  constructor() {}

  public ngOnInit() {}

  // tslint:disable-next-line:typedef
  public playSheet(evt: MouseEvent, id: number) {
    evt.stopPropagation();
    this.onPlay.emit(id);
  }
}
