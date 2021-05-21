import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import queryString from 'query-string';
import { Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/internal/operators';
import { Song, SongSheet } from './data-types/common.types';
import { API_CONFIG, ServicesModule } from './services.module';
import { SongService } from './song.service';

// tslint:disable-next-line:interface-name
export interface SheetParams {
  offset: number;
  limit: number;
  order: 'new' | 'hot';
  cat: string;
}

@Injectable({
  providedIn: ServicesModule,
})
export class SheetService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string,
    private songServe: SongService,
  ) {}

  // 获取歌单列表
  // getSheets(args: SheetParams): Observable<SheetList> {
  //   const params = new HttpParams({ fromString: queryString.stringify(args) });
  //   return this.http
  //     .get(this.uri + "top/playlist", { params })
  //     .pipe(map((res) => res as SheetList));
  // }
  // 获取歌单详情
  public getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.uri + 'playlist/detail', { params })
      .pipe(map((res: { playlist: SongSheet }) => res.playlist));
  }

  // 调用歌单详情 再调播放地址
  public playSheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id).pipe(
      pluck('tracks'), // pluck 筛选功能
      switchMap((tracks) => this.songServe.getSongList(tracks)),
    );
  }
}
