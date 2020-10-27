import { MarketStatus } from "./MarketStatus";
import { MarketType } from "./MarketType";

export type MarketFilters = {
	exchangeSymbol?: string;
	baseSymbol?: string;
	quoteSymbol?: string;
	marketType?: MarketType;
	marketStatus?: MarketStatus;
};
