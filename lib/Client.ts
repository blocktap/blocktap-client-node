import { request } from "./request";
import * as querystring from "querystring";
import { WebProtocol } from "./WebProtocol";
import { HttpMethod } from "./HttpMethod";
import { MarketFilters } from "./types/MarketFilter";
import { Market } from "./types/Market";

export class BlocktapClient {
	public graphqlHostname = "api.blocktap.io";
	public graphqlPath = "/graphql";
	public graphqlProtocol = WebProtocol.https;

	public restHostname = "rest.blocktap.io";
	public restProtocol = WebProtocol.https;

	/**
	 * Creates a BlocktapClient with the specified API Key.
	 * @param apiKey optional API key for Blocktap.io
	 */
	constructor(readonly apiKey?: string) {}

	/**
	 * Sends a query to Blocktap.io graphql endpoint
	 */
	public async query({ query, variables }: { query: any; variables?: any }): Promise<any> {
		return request({
			hostname: this.graphqlHostname,
			path: this.graphqlPath,
			headers: this._authHeaders(),
			json: { query, variables },
			protocol: this.graphqlProtocol,
		});
	}

	/**
	 * Retrieves a list of markets based on the supplied filters
	 * @param filters
	 */
	public async markets(filters?: MarketFilters): Promise<Market[]> {
		return await this._getRest("/markets" + (filters ? "?" + querystring.encode(filters) : ""));
	}

	/**
	 * Retrieves a single market based on the unique marketId
	 * @param marketId
	 */
	public async market(marketId: string): Promise<Market> {
		return await this._getRest("/markets/" + marketId);
	}

	private async _getRest<T>(path: string): Promise<T> {
		return request({
			hostname: this.restHostname,
			path,
			method: HttpMethod.GET,
			headers: this._authHeaders(),
			protocol: this.restProtocol,
		});
	}

	private _authHeaders(): any {
		const headers: any = {};
		if (this.apiKey) {
			headers["Authorization"] = "Bearer " + this.apiKey;
		}
		return headers;
	}
}
