export class RequestError extends Error {
	/**
	 * Error for bad requests
	 */
	constructor(readonly statusCode: number, readonly body: string) {
		super("Request failed");
		Object.setPrototypeOf(this, RequestError.prototype);
	}
}
