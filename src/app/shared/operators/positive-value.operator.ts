import { get } from 'lodash';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export function positiveValue<T>(key?: keyof T): MonoTypeOperatorFunction<T> {
  return (input$): Observable<T> => {
    return input$.pipe(
      filter<T>((item) => {
        return Array.isArray(item) ? item.length > 0 : Boolean(key ? get(item, key) : item);
      })
    );
  };
}
