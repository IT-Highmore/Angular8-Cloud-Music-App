import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { Banner, HotTag, Singer, SongSheet } from './data-types/common.types';
import { API_CONFIG, ServicesModule } from './services.module';
// tslint:disable-next-line:ordered-imports
import queryString from 'query-string';

type SingerParams = {
  offset: number,
  limit: number,
  cat?: string,
}

const defaultParams: SingerParams = {
  offset: 0,
  limit: 9,
  cat: '5001',
}

@Injectable({
  providedIn: ServicesModule,
})
export class SingerService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) {}

  public getEnterSingers(args: SingerParams = defaultParams): Observable<Singer[]> {
    const params = new HttpParams({ fromString: queryString.stringify(args)});
    return this.http.get(this.uri + 'artist/list', { params })
    .pipe(map((res: {artists: Singer[]}) => res.artists));
  }

  // public getHotTags(): Observable<HotTag[]> {
  //   return this.http
  //     .get(this.uri + 'playlist/hot')
  //     .pipe(map((res: { tags: HotTag[] }) => {
  //       return res.tags
  //         .sort((x: HotTag, y: HotTag) => x.position - y.position)
  //         .slice(0, 5);
  //     }));
  // }

  // public getPersonalSheetLIst(): Observable<SongSheet[]> {
  //   return this.http
  //     .get(this.uri + 'personalized')
  //     .pipe(map((res: { result: SongSheet[] }) => res.result.slice(0, 16)));
  // }
}
