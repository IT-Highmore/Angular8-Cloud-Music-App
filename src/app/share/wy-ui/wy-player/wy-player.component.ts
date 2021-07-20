import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyPlayerComponent implements OnInit {
  public sliderValue = 35;
  public bufferOffset = 70;
  constructor() { }

  ngOnInit() {
  }

}
