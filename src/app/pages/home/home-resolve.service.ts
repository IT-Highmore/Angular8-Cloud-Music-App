import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { first } from 'rxjs/internal/operators';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service';
import { Banner, HotTag, Singer, SongSheet } from '../../services/data-types/common.types';
// first 只取第一个
type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];

@Injectable()
export class HomeResolverService implements Resolve<HomeDataType> {
  constructor(
    private homeServe: HomeService,
    private singerServe: SingerService,
  ) {}
  public resolve(): Observable<HomeDataType> {
    return forkJoin([
      this.homeServe.getBanners(),
      this.homeServe.getHotTags(),
      this.homeServe.getPersonalSheetList(),
      this.singerServe.getEnterSingers(),
    ]).pipe(first());
  }
}
