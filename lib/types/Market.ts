import { MarketStatus } from "./MarketStatus";
import { MarketType } from "./MarketType";
import { OptionType } from "./OptionType";

export type Market = {
	id: string;
	marketSymbol: string;
	marketType: MarketType;
	marketStatus: MarketStatus;
	exchangeSymbol: string;
	baseSymbol: string;
	quoteSymbol: string;
	remoteId: string;
	expiryDate: string;
	optionType: OptionType;
	optionStrike: string;
};
