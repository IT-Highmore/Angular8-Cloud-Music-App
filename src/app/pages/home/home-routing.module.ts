import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeResolverService } from './home-resolve.service';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent, data: {ttle: '发现'},  resolve: {homeDatas: HomeResolverService} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  // tslint:disable-next-line:object-literal-sort-keys
  exports: [RouterModule],
  providers: [HomeResolverService],
})
export class HomeRoutingModule {}
