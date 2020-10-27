import { MarketStatus } from "./MarketStatus";
import { MarketType } from "./MarketType";

export type Market = {
	id: string;
	marketSymbol: string;
	marketType: MarketType;
	marketStatus: MarketStatus;
	exchangeSymbol: string;
	baseSymbol: string;
	quoteSymbol: string;
	remoteId: string;
};
