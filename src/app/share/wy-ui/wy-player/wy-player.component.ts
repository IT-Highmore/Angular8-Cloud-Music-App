import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Song } from 'src/app/services/data-types/common.types';
import { AppStoreModule } from 'src/app/store';
import { SetCurrentIndex } from 'src/app/store/actions/player.actions';
import { getCurrentIndex, getCurrentSong, getPlayer, getPlayList, getPlayMode, getSongList } from 'src/app/store/selectors/player.selector';
import { PlayMode } from './player-type';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyPlayerComponent implements OnInit {
  public percent = 0;
  public bufferPercent = 0;
  public songList: Song[];
  public playList: Song[];
  public currentIndex: number;
  public currentSong: Song;
  public duration: number;
  public currentTime: number;

  // 播放状态
  playing = false;
  // 是否可以播放
  songReady = false;
  // 是否显示列表面板
  showPanel = false;

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
      this.bufferPercent = 0;
    }
    console.log('song', this.currentSong);
  }

  public onCanPlay() {
    this.songReady = true;
    this.play();
  }

  private play() {
    this.audioEl.play();
    this.playing = true;
  }
  onPercentChange(per: number) {
    this.audioEl.currentTime = this.duration * (per / 100);
  }

  onTimeUpdate(e: Event) {
    this.currentTime = (e.target as HTMLAudioElement).currentTime;
    this.percent = (this.currentTime / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    if (buffered.length && this.bufferPercent < 100) {
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }
  }

  // 上一曲
  onPrev(index: number) {
    if (!this.songReady) {
      return;
    }
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index < 0 ? this.playList.length - 1 : index;
      this.updateIndex(newIndex);
    }
  }

  // 下一曲
  onNext(index: number) {
    if (!this.songReady) {
      return;
    }
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index >= this.playList.length ? 0 : index;
      this.updateIndex(newIndex);
    }
  }


  // 播放暂停
  onToggle() {
    if (!this.currentSong) {
      if (this.playList.length) {
        this.updateIndex(0);
      }
    } else {
      if (this.songReady) {
        this.playing = !this.playing;
        if (this.playing) {
          this.audioEl.play();
        } else {
          this.audioEl.pause();
        }
      }
    }
  }

  // 单曲循环
  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
    // if (this.playerPanel) {
    //   this.playerPanel.seekLyric(0);
    // }
  }

  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
    this.songReady = false;
  }

  get picUrl(): string {
    return this.currentSong
      ? this.currentSong.al.picUrl
      : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }
}
