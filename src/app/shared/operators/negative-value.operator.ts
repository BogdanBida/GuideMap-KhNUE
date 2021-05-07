import { negate } from 'lodash';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export function negativeValue<T>(): MonoTypeOperatorFunction<T> {
  return (input$): Observable<T> => input$.pipe(filter<T>(negate(Boolean)));
}
