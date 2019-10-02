// @ts-check

const { request } = require('./request');

class BlocktapClient {
	/**
	 * Creates a BlockapClient with the specified API Key.
	 * @param {string} [apikey] optional API key for Blocktap.io
	 */
	constructor(apikey) {
		/**
		 * API for blocktap
		 * @type {string}
		 */
		this.apikey = apikey;

		/**
		 *
		 * @type {string}
		 */
		this.hostname = 'api.blocktap.io';
		this.path = '/graphql';
		this.protocol = 'https';
	}

	/**
	 * Sends a query to Blocktap.io
	 * @param {object} p
	 * @param {string} p.query GraphQL query
	 * @param {object} p.variables
	 * @returns {Promise<object>}
	 */
	query({ query, variables }) {
		let headers = {};
		if (this.apikey) {
			headers['authentication'] = 'Bearer ' + this.apikey;
		}
		return request({
			hostname: this.hostname,
			path: this.path,
			headers,
			json: { query, variables },
			protocol: this.protocol,
		});
	}
}

module.exports.BlocktapClient = BlocktapClient;
