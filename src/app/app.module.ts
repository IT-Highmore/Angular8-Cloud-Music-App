import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule],
  // tslint:disable-next-line:object-literal-sort-keys
  bootstrap: [AppComponent],
})
export class AppModule {}
