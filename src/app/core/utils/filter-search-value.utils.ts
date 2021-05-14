import { IOption } from '../../feature/map/interfaces';

export const filterSearchValue = (
  option: IOption[],
  value: string
): IOption[] => {
  const filterValue = value.toLowerCase();

  return option.filter(
    (item) => item.viewValue.toLowerCase().indexOf(filterValue) === 0
  );
};
