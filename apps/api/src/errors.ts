/** Typed application errors. The global onError maps these to `{ error: { code, message } }`. */
export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const Errors = {
  unauthorized: () => new AppError(401, 'UNAUTHORIZED', 'Missing or invalid owner credentials'),
  notFound: (what = 'Resource') => new AppError(404, 'NOT_FOUND', `${what} not found`),
  badRequest: (message: string) => new AppError(400, 'BAD_REQUEST', message),
  payloadTooLarge: () => new AppError(413, 'PAYLOAD_TOO_LARGE', 'Request body exceeds the limit'),
  notImplemented: (what = 'Endpoint') => new AppError(501, 'NOT_IMPLEMENTED', `${what} is not implemented yet`),
};
