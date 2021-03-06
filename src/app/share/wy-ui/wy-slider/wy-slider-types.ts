import { Observable } from 'rxjs';

// tslint:disable-next-line:interface-name
export interface WySliderStyle {
  width?: string | null;
  height?: string | null;
  left?: string | null;
  bottom?: string | null;
}

// tslint:disable-next-line:interface-name
export interface SliderEventObserverConfig {
  start: string;
  move: string;
  end: string;
  filter: (e: Event) => boolean;
  pluckKey: string[];
  startPlucked$?: Observable<number>;
  moveResolved$?: Observable<number>;
  end$?: Observable<Event>;
}

export type SliderValue = number | null;
