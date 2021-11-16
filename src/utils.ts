export function notFoundResponse(
  element: string,
  elements: string[],
  name: string,
) {

  let prefix: string;
  if (element === '') {
    prefix = `Please specify a(n) ${name}.`;
  } else {
    prefix = `${name} '${element}' does not exist.`;
  }

  return errorResponse(
    'NotFound',
    'Not found.',
    `${prefix} Possible values: ${arrayToString(elements)}.`,
    404,
    'Not Found',
  );
}

export function errorResponse(
  code: string,
  message: string,
  details: string,
  status: number,
  statusText: string,
) {
  return new Response(
    JSON.stringify({
      error: {
        code: code,
        message: message,
        details: details,
      },
    }),
    {
      status: status,
      statusText: statusText,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

export function arrayToString(elements: string[]) {
  if (elements.length === 0) return '[]';

  let str = '[';
  elements.forEach(e => str += '\'' + e + '\', ');
  return str.substr(0, str.length - ', '.length) + ']';
}
