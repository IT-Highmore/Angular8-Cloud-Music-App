import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { map } from 'rxjs/internal/operators/map';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/data-types/common.types';
import { SheetService } from 'src/app/services/sheet.service';
import { AppStoreModule } from 'src/app/store';
import { SetCurrentIndex, SetPlayList, SetSongList } from 'src/app/store/actions/player.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  // tslint:disable-next-line:object-literal-sort-keys
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  public carouselActiveIndex = 0;
  public banners: Banner[];
  public hotTags: HotTag[];
  public someSheetList: SongSheet[];
  public singers: Singer[];

  @ViewChild(NzCarouselComponent, { static: true })
  private nzCarousel: NzCarouselComponent;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private store$: Store<AppStoreModule>,
  ) {
    this.route.data
      .pipe(map((res) => res.homeDatas))
      .subscribe(([banners, hotTags, songSheetList, singers]) => {
        this.banners = banners;
        this.hotTags = hotTags;
        this.someSheetList = songSheetList;
        this.singers = singers;
      });
  }

  ngOnInit() {}

  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }

  public onPlaySheet(id: number) {
    this.sheetService.playSheet(id).subscribe((list) => {
      console.log('res', list);
      this.store$.dispatch(SetSongList({ songList: list }));
      this.store$.dispatch(SetPlayList({ playList: list }));
      this.store$.dispatch(SetCurrentIndex({ currentIndex: 0 }));
    });
  }
}
