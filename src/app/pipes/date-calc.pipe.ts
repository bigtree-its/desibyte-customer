import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../services/common/utils';

@Pipe({
  name: 'dateCalc',
  standalone: true,
})
export class DateCalcPipe implements PipeTransform {
  transform(value: any, operation: string, count: number, tz: string): unknown {
    if (value) {
      var date;
      if (tz) {
        date = this.convertTZ(value, tz);
      } else {
        date = new Date(value);
      }
      if (Utils.isEquals(operation, 'add')) {
        return new Date(date.getTime() + count * 24 * 60 * 60 * 1000);
      } else if (Utils.isEquals(operation, 'sub')) {
        return new Date(date.getTime() - count * 24 * 60 * 60 * 1000);
      }
    }
    return value;
  }

  convertTZ(date, tzString) {
    return new Date(
      (typeof date === 'string' ? new Date(date) : date).toLocaleString(
        'en-US',
        { timeZone: tzString }
      )
    );
  }
}
