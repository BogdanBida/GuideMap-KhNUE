import { GmpQueryParams } from '../models';

const URL_REGEXP =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export function queryParamsExtractor(url: string): GmpQueryParams {
  if (!URL_REGEXP.test(url)) {
    throw new Error('Invalid url');
  }

  const queryParams = url.split('?')[1]?.split('&');

  if (!queryParams) {
    return {};
  }

  return queryParams
    .map((queryParam) => {
      const [name, value] = queryParam.split('=');

      return [name, value];
    })
    .reduce((result, param) => {
      result[param[0]] = param[1];

      return result;
    }, {} as { [key: string]: string });
}

function screenAddress(url: string): string {
  return url.replace(/[.?/\\]/g, '\\$&');
}

export const RoutingUtils = {
  screenAddress,
};
