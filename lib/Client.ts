import { request } from "./request";
import * as querystring from "querystring";
import { WebProtocol } from "./WebProtocol";
import { HttpMethod } from "./HttpMethod";
import { MarketFilters } from "./types/MarketFilter";
import { Market } from "./types/Market";
import { CandlePeriod } from "./types/CandlePeriod";
import { Candle } from "./types/Candle";
import { Trade } from "./types/Trade";
import { Exchange } from "./types/Exchange";

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
	 * Retrieves a list of exchanges
	 */
	public async exchanges(): Promise<Exchange[]> {
		return await this._getRest("/exchanges");
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

	/**
	 * Retrieves candles for the market in the given time range
	 * @param marketId unique identifier for the market, such as `coinbasepro_btc_usd`
	 * @param startDate start date in ISO-8601 format, such as `2020-01-01T00:00:00.000Z`
	 * @param endDate end date exclusive in ISO-8601 format, such as `2020-01-02T00:00:00.000Z`
	 * @param period period for which trade data is aggregate, such as 1 minute, 1 hour, or 1 day
	 */
	public async candles(
		marketId: string,
		startDate: string,
		endDate: string,
		period: CandlePeriod
	): Promise<Candle[]> {
		const qs = querystring.encode({ startDate, endDate, period });
		return await this._getRest(`/markets/${marketId}/candles?${qs}`);
	}

	/**
	 * Retrieves trades for the market in the given time range.
	 * @param marketId unique identifier for the market, such as `coinbasepro_btc_usd`
	 * @param startDate start date in ISO-8601 format, such as `2020-01-01T00:00:00.000Z`
	 * @param endDate end date exclusive in ISO-8601 format, such as `2020-01-02T00:00:00.000Z`
	 */
	public async trades(marketId: string, startDate: string, endDate: string): Promise<Trade[]> {
		const qs = querystring.encode({ startDate, endDate });
		return await this._getRest(`/markets/${marketId}/trades?${qs}`);
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
