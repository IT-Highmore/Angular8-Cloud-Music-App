import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { playerReducer } from './reducers/player.reducer';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot(
      { player: playerReducer },
      {
        runtimeChecks: {
          strictStateImmutability: true,
          // tslint:disable-next-line:object-literal-sort-keys
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
        },
      },
    ),
    StoreDevtoolsModule.instrument({
      maxAge: 20,
      // tslint:disable-next-line:object-literal-sort-keys
      logOnly: environment.production,
    }),
  ],
})
export class AppStoreModule {}
