import * as querystring from "querystring";
import * as url from "url";
import { Candle } from "./types/Candle";
import { CandlePeriod } from "./types/CandlePeriod";
import { Currency } from "./types/Currency";
import { CurrencyFilter } from "./types/CurrencyFilter";
import { Exchange } from "./types/Exchange";
import { Market } from "./types/Market";
import { MarketFilters } from "./types/MarketFilter";
import { Trade } from "./types/Trade";
import { request } from "./request";

export class BlocktapClient {
	public readonly graphqlParts: url.UrlWithStringQuery;
	public readonly restParts: url.UrlWithStringQuery;

	/**
	 * Creates a BlocktapClient with the specified API Key.
	 * @param apiKey optional API key for Blocktap.io
	 */
	constructor(
		readonly apiKey?: string,
		readonly graphqlUri = "https://api.blocktap.io/graphql",
		readonly restUri = "https://rest.blocktap.io"
	) {
		this.graphqlParts = url.parse(graphqlUri);
		this.restParts = url.parse(restUri);
	}

	/**
	 * Sends a query to Blocktap.io graphql endpoint
	 */
	public async query({ query, variables }: { query: any; variables?: any }): Promise<any> {
		return request({
			...this.graphqlParts,
			headers: this._authHeaders(),
			json: { query, variables },
		});
	}

	/**
	 * Retrieves a list of currencies using the optional filters
	 */
	public async currencies(filters?: CurrencyFilter): Promise<Currency[]> {
		const qs = filters ? "?" + querystring.encode(filters) : "";
		return await this._getRest("/currencies" + qs);
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
			...this.restParts,
			path,
			method: "GET",
			headers: this._authHeaders(),
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
