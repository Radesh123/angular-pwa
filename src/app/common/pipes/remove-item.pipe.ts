import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeItem'
})
export class RemoveItemPipe implements PipeTransform {

  transform(items: any[], prop1: string, prop2: string, formdata: any, value: string): any {
    console.log('value ',value);
    return items.filter(item => {
      let aaa = formdata.some(elm => {
        if (elm[prop2] == item[prop1] && (value === '' || value != item[prop1])) {
          return true;
        }
        return false;
      })
      console.log(aaa);
      return !aaa;
    });
  }

}
