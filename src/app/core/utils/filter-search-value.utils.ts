import { IOption } from '../../feature/map/interfaces';

export const filterSearchValue = (
  options: IOption[],
  value: string
): IOption[] => {
  const filterValue = value.toLowerCase();

  const regEx = new RegExp(`(^|\\s)${filterValue}`, 'ig');

  return options.filter((item) => regEx.test(item.viewValue));
};
