import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fromEvent, Subscription } from 'rxjs';
import { Song } from 'src/app/services/data-types/common.types';
import { AppStoreModule } from 'src/app/store';
import { SetCurrentIndex, SetPlayList, SetPlayMode } from 'src/app/store/actions/player.actions';
import { getCurrentIndex, getCurrentSong, getPlayer, getPlayList, getPlayMode, getSongList } from 'src/app/store/selectors/player.selector';
import { shuffle } from 'src/app/utils/array';
import { PlayMode } from './player-type';

const modeTypes: PlayMode[] = [{
  type: 'loop',
  label: '循环'
}, {
  type: 'random',
  label: '随机'
}, {
  type: 'singleLoop',
  label: '单曲循环'
}];
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
  // 音量
  volume = 60;

  // 是否显示音量面板
  showVolumnPanel = false;

  // 是否点击的是音量面板本身
  selfClick = false;

  // 当前模式
  currentMode: PlayMode;
  modeCount = 0;
  private winClick: Subscription;

  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document
  ) {
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
    // console.log('mode', mode);
    this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(this.songList);
        this.updateCurrentIndex(list, this.currentSong);
        this.store$.dispatch(SetPlayList({ playList: list }));
      }
    }
  }

  private watchCurrentSong(song: Song) {
    if (song) {
      this.duration = song.dt / 1000;
      this.currentSong = song;
      this.bufferPercent = 0;
    }
    // console.log('song', this.currentSong);
  }

  private updateCurrentIndex(list: Song[], song: Song) {
    const newIndex = list.findIndex((item) => item.id === song.id);
    this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));
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
    if (this.currentSong) {
      this.audioEl.currentTime = this.duration * (per / 100);
    }
  }
  // 控制音量
  onVolumeChange(per: number) {
    this.audioEl.volume = per / 100; // 音量是0-1
  }

  // 控制音量面板
  toggleVolPanel() {
    this.togglePanel();
  }

  togglePanel() {
    this.showVolumnPanel = !this.showVolumnPanel;
    if (this.showVolumnPanel) {
      this.bindDocumentClickListener();
    } else {
      this.unbindDocumentClickListener();
    }
  }
  // 改变模式
  changeMode() {
    const temp = modeTypes[++this.modeCount % 3];
    this.store$.dispatch(SetPlayMode({ playMode: temp }));
  }

  private bindDocumentClickListener() {
    if (!this.winClick) {
      this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
        if (!this.selfClick) {
          // 说明点了播放器以外的部分
          this.showVolumnPanel = false;
          this.bindDocumentClickListener();
        }
        this.selfClick = false;
      });
    }
  }

  private unbindDocumentClickListener() {
    if (this.winClick) {
      this.winClick.unsubscribe();
      this.winClick = null;
    }
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

  // 播放结束
  onEnded() {
    this.playing = false;
    if (this.currentMode.type === 'singleLoop') {
      this.loop();
    } else {
      this.onNext(this.currentIndex + 1);
    }
  }

  onError() {}

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
