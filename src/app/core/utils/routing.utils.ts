import { QueryParam } from './../models/query-param';
const URL_REGEXP =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export function queryParamsExtractor(
  url: string,
  params: string[]
): QueryParam[] {
  if (!URL_REGEXP.test(url)) {
    throw new Error('Invalid url');
  }

  const queryParams = url.split('?')[1]?.split('&');

  if (!queryParams) {
    return [];
  }

  return queryParams
    .map((queryParam) => {
      const [name, value] = queryParam.split('=');

      return { name, value };
    })
    .filter((queryParam) => params.includes(queryParam.name));
}
