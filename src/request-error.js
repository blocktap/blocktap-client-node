// @ts-check

class RequestError extends Error {
	/**
	 * Error for bad requests
	 * @param {number} statusCode
	 * @param {string} body
	 */
	constructor(statusCode, body) {
		super();
		this.message = 'Request failed';
		this.statusCode = statusCode;
		this.body = body;
	}
}

exports.RequestError = RequestError;
