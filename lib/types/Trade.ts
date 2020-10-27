import { TradeSide } from "./TradeSide";

export type Trade = {
	id: string;
	unix: number;
	side: TradeSide;
	price: string;
	amount: string;
};
