import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(time: number, ...args: any[]): any {
    if (time) {
      // tslint:disable-next-line:no-bitwise
      const temp = time | 0; // 向下取整
      // tslint:disable-next-line:no-bitwise
      const minute = temp / 60 | 0;
      const second = (temp % 60).toString().padStart(2, '0'); // padStart 前置补0
      return `${minute}:${second}`;
    }
    return '00:00';
  }

}
