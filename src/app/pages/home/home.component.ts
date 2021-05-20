import { Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/data-types/common.types';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.less"],
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];
  hotTags: HotTag[];
  someSheetList: SongSheet[];
  singers: Singer[];

  @ViewChild(NzCarouselComponent, { static: true })
  private nzCarousel: NzCarouselComponent;

  constructor(
    private homeServe: HomeService,
    private singerServce: SingerService
  ) {
    this.getBanners();
    this.getHotTags();
    this.getPersonalizedSheetList();
    this.getEnterSingers();
  }

  // tslint:disable-next-line:typedef
  private getBanners() {
    this.homeServe.getBanners().subscribe((banners) => {
      this.banners = banners;
    });
  }

  // tslint:disable-next-line:typedef
  private getHotTags() {
    this.homeServe.getHotTags().subscribe((tags) => {
      this.hotTags = tags;
    });
  }

  // tslint:disable-next-line:typedef
  private getPersonalizedSheetList() {
    this.homeServe.getPersonalSheetLIst().subscribe((sheets) => {
      this.someSheetList = sheets;
    });
  }

  // tslint:disable-next-line:typedef
  private getEnterSingers() {
    this.singerServce.getEnterSingers().subscribe((singers) => {
      console.log(singers);
      this.singers = singers;
    });
  }

  ngOnInit() {}

  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: "pre" | "next") {
    this.nzCarousel[type]();
  }
}
