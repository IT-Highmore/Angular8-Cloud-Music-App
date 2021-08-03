import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Song } from 'src/app/services/data-types/common.types';
import { AppStoreModule } from 'src/app/store';
import { getCurrentIndex, getCurrentSong, getPlayer, getPlayList, getPlayMode, getSongList } from 'src/app/store/selectors/player.selector';
import { PlayMode } from './player-type';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyPlayerComponent implements OnInit {
  public sliderValue = 35;
  public bufferOffset = 70;
  public songList: Song[];
  public playList: Song[];
  public currentIndex: number;
  public currentSong: Song;
  public duration: number;
  public currentTime: number;
  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(private store$: Store<AppStoreModule>) {
    const appStore$ = this.store$.pipe(select(getPlayer));
    appStore$
      .pipe(select(getSongList))
      .subscribe((list) => this.watchList(list, 'songList'));
    appStore$
      .pipe(select(getPlayList))
      .subscribe((list) => this.watchList(list, 'playList'));
    appStore$
      .pipe(select(getCurrentIndex))
      .subscribe((index) => this.watchCurrentIndex(index));
    appStore$
      .pipe(select(getPlayMode))
      .subscribe((mode) => this.watchPlayMode(mode));
    appStore$
      .pipe(select(getCurrentSong))
      .subscribe((song) => this.watchCurrentSong(song));
    // appStore$.pipe(select(getCurrentAction)).subscribe(action => this.watchCurrentAction(action));
  }

  public ngOnInit() {
    console.log('audio', this.audio.nativeElement);
    this.audioEl = this.audio.nativeElement;
  }
  private watchList(list: Song[], type: string) {
    this[type] = list;
  }
  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }
  private watchPlayMode(mode: PlayMode) {
    console.log('mode', mode);
  }

  private watchCurrentSong(song: Song) {
    if (song) {
      this.duration = song.dt / 1000;
      this.currentSong = song;
    }
    console.log('song', song, this.currentSong);

  }

  public onCanPlay() {
    this.play();
  }

  private play() {
    this.audioEl.play();
    console.log(this.audioEl);
  }
  onTimeUpdate(e: Event) {
    this.currentTime = (e.target as HTMLAudioElement).currentTime;
  }

  get picUrl(): string {
    return this.currentSong
      ? this.currentSong.al.picUrl
      : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }
}
