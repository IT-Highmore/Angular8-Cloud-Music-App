// tslint:disable-next-line:interface-over-type-literal
export type Banner = {
  targetId: number;
  url: string;
  imageUrl: string;
};
// tslint:disable-next-line:interface-over-type-literal
export type HotTag = {
  id: number;
  name: string;
  position: number;
};

// 歌单
// tslint:disable-next-line:interface-over-type-literal
export type SongSheet = {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
};

// 歌手
// tslint:disable-next-line:interface-over-type-literal
export type Singer = {
  id: number;
  name: string;
  picUrl: string;
  albumSize: number;
};
