import { Action, createReducer, on } from '@ngrx/store';
import { Song } from 'src/app/services/data-types/common.types';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-type';
import { SetCurrentIndex, SetPlaying, SetPlayList, SetPlayMode, SetSongList } from '../actions/player.actions';

// export enum CurrentActions {
//   Add,
//   Play,
//   Delete,
//   Clear,
//   Other,
// }
// tslint:disable-next-line:interface-name
export interface PlayState {
  // 播放状态
  playing: boolean;

  // 播放模式
  playMode: PlayMode;

  // 歌曲列表
  songList: Song[];

  // 播放列表
  playList: Song[];

  // 当前正在播放的索引
  currentIndex: number;

  // 当前操作
  // currentAction: CurrentActions;
}

export const initialState: PlayState = {
  playing: false,
  songList: [],
  // tslint:disable-next-line:object-literal-sort-keys
  playList: [],
  playMode: { type: 'loop', label: '循环'},
  currentIndex: -1,
  // currentAction: CurrentActions.Other,
};

const reducer = createReducer(
  initialState,
  on(SetPlaying, (state, { playing }) => ({ ...state, playing })), // 修改state数据返回一个新的state
  on(SetPlayList, (state, { playList }) => ({ ...state, playList })),
  on(SetSongList, (state, { songList }) => ({ ...state, songList })),
  on(SetPlayMode, (state, { playMode }) => ({ ...state, playMode })),
  on(SetCurrentIndex, (state, { currentIndex }) => ({
    ...state,
    currentIndex,
  })),
  // on(SetCurrentAction, (state, { currentAction }) => ({
  //   ...state,
  //   currentAction,
  // })),
);

export function playerReducer(state: PlayState, action: Action) {
  return reducer(state, action);
}
