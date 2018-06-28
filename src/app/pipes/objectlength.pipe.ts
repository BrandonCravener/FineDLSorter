import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectLength'
})
export class ObjectLengthPipe implements PipeTransform {

  transform(value: any, args?: any): number {
    return Object.keys(value).length;
  }

}
