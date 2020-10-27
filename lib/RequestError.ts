export class RequestError extends Error {
	/**
	 * Error for bad requests
	 */
	constructor(readonly statusCode: number, readonly body: string) {
		super(`Request failed - ${statusCode} error`);
		Object.setPrototypeOf(this, RequestError.prototype);
	}
}
