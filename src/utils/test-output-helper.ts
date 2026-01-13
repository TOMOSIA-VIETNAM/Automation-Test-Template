export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0B';
  const k = 1024;
  const sizes = ['B', 'kB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + sizes[i];
}

export function getStatusText(statusCode: number): string {
  const statusMap: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
  };
  return statusMap[statusCode] || 'Unknown';
}

export function displayRequest(_method: string, _url: string): void {
  // Display request (console.log removed)
}

export function displayResponse(_statusCode: number, _size: number, _time: number): void {
  // Display response (console.log removed)
}

export function displayResponseBody(_responseBody: unknown): void {
  // Display response body (console.log removed)
}

export interface Assertion {
  message: string;
  passed: boolean;
}

export function displayAssertions(_assertions: Assertion[]): void {
  // Display assertions (console.log removed)
}
