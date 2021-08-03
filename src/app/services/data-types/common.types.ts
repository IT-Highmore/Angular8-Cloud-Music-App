export interface AnyJson {
  [key: string]: any;
}
// tslint:disable-next-line:interface-name
export interface Banner {
  targetId: number;
  url: string;
  imageUrl: string;
}
// tslint:disable-next-line:interface-name
export interface HotTag {
  id: number;
  name: string;
  position: number;
}

// 播放地址
// tslint:disable-next-line:interface-name
export interface SongUrl {
  id: number;
  url: string;
}

// 歌单
// tslint:disable-next-line:interface-name
export interface SongSheet {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
  tracks: Song[];
}

// 歌手
// tslint:disable-next-line:interface-name
export interface Singer {
  id: number;
  name: string;
  picUrl: string;
  albumSize: number;
}

// 歌曲
// tslint:disable-next-line:interface-name
export interface Song {
  id: number;
  name: string;
  url: string;
  ar: Singer[];
  al: { id: number; name: string; picUrl: string };
  dt: number;
}

// 歌单
// tslint:disable-next-line:interface-over-type-literal
// export type Song = {
//   id: number;
//   name: string;
//   url: string;
//   ar: Singer[];
//   al: {id: number; name: string, picUrl: string};
//   dt: number
// };
