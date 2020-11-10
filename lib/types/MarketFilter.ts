import { MarketStatus } from "./MarketStatus";
import { MarketType } from "./MarketType";
import { OptionType } from "./OptionType";

export type MarketFilters = {
	/**
	 * Filter to a specific exchange
	 */
	exchangeSymbol?: string;

	/**
	 * Filter to a specific base symbol
	 */
	baseSymbol?: string;

	/**
	 * Filter to a specific quote symbol
	 */
	quoteSymbol?: string;

	/**
	 * Filter to a specific type of market.
	 */
	marketType?: MarketType;

	/**
	 * Filter by status of the market: Active or Inactive
	 */
	marketStatus?: MarketStatus;

	/**
	 * Filter by the day of contract expiry in the format `YYYY-MM-DD`
	 */
	expiryDate?: string;

	/**
	 * Filter by the type of option contract: Call or Pu
	 */
	optionType?: OptionType;

	/**
	 * Filter by the strike price of an option contract
	 */
	optionStrike?: number;
};
