import { request } from "./request";
import { WebProtocol } from "./WebProtocol";

export class BlocktapClient {
	public hostname = "api.blocktap.io";
	public path = "/graphql";
	public protocol = WebProtocol.https;

	/**
	 * Creates a BlocktapClient with the specified API Key.
	 * @param apiKey optional API key for Blocktap.io
	 */
	constructor(readonly apiKey?: string) {}

	/**
	 * Sends a query to Blocktap.io graphql endpoint
	 */
	public query({ query, variables }: { query: any; variables?: any }): Promise<any> {
		const headers: any = {};
		if (this.apiKey) {
			headers["Authorization"] = "Bearer " + this.apiKey;
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
