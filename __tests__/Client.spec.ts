import { expect } from "chai";
import { BlocktapClient } from "../lib";
import { RequestError } from "../lib";
import { CandlePeriod } from "../lib/types/CandlePeriod";
import { MarketStatus } from "../lib/types/MarketStatus";

function expectReject(promise: Promise<any>, done: Mocha.Done) {
	promise.then(() => done(new Error("Expected rejection"))).catch(() => done());
}

const fixtures: any = {};

fixtures.basicQuery = `
query price {
	market(id: "binance_btc_usdt") {
		id
	}
}`;

fixtures.restrictedData = `
query price {
	market(id: "binance_btc_usdt") {
		id
    ohlcv(resolution:_1m limit:5)
	}
}`;

fixtures.badQuery = `
query price {
	market {}
}`;

describe("BlocktapClient", () => {
	xdescribe("not authenticated", () => {
		describe(".query", () => {
			it("should return results of valid query", async () => {
				const sut = new BlocktapClient();
				const result = await sut.query({ query: fixtures.basicQuery });
				expect(result.data.market.id).to.equal("binance_btc_usdt");
			});

			it("should return results of bad query", async () => {
				const sut = new BlocktapClient();
				const result = await sut.query({ query: fixtures.badQuery });
				expect(result.errors.length).to.be.greaterThan(0);
			});

			it("should reject on invalid request", () => {
				const sut = new BlocktapClient();
				sut.graphqlPath = "/graphqll";
				return sut
					.query({ query: fixtures.basicQuery })
					.then(() => {
						throw new Error("Should not succeed");
					})
					.catch(err => {
						expect(err).to.be.an.instanceOf(RequestError);
					});
			});

			it("should return null for restricted data", async () => {
				const sut = new BlocktapClient();
				const result = await sut.query({ query: fixtures.restrictedData });
				expect(result.data.market.ohlcv).to.be.null;
			});
		});
	});
	describe("authenticated", () => {
		let sut: BlocktapClient;
		before(function() {
			if (!process.env.BLOCKTAP_KEY) {
				this.skip();
			}
			sut = new BlocktapClient(process.env.BLOCKTAP_KEY);
		});
		describe(".query", () => {
			it("should return restricted data", async () => {
				const result = await sut.query({ query: fixtures.restrictedData });
				expect(result.data.market.ohlcv).to.not.be.null;
			});
		});

		xdescribe(".markets()", () => {
			it("no filters", async () => {
				const result = await sut.markets();
				expect(result.length).to.be.gt(0);
				expect(result[0].id).to.be.a("string");
				expect(result[0].marketSymbol).to.be.a("string");
				expect(result[0].marketType).to.be.a("string");
				expect(result[0].marketStatus).to.be.a("string");
				expect(result[0].exchangeSymbol).to.be.a("string");
				expect(result[0].baseSymbol).to.be.a("string");
				expect(result[0].quoteSymbol).to.be.a("string");
				expect(result[0].remoteId).to.be.a("string");
			});

			it("exchange filter", async () => {
				const result = await sut.markets({ exchangeSymbol: "CoinbasePro" });
				expect(result.every(p => p.exchangeSymbol === "CoinbasePro")).to.equal(true);
			});

			it("base filter", async () => {
				const result = await sut.markets({ baseSymbol: "BTC" });
				expect(result.every(p => p.baseSymbol === "BTC")).to.equal(true);
			});

			it("quote filter", async () => {
				const result = await sut.markets({ quoteSymbol: "BTC" });
				expect(result.every(p => p.quoteSymbol === "BTC")).to.equal(true);
			});

			it("status filter", async () => {
				const result = await sut.markets({ marketStatus: MarketStatus.Active });
				expect(result.every(p => p.marketStatus === MarketStatus.Active)).to.equal(true);
			});
		});

		xdescribe(".market()", () => {
			it("when exists", async () => {
				const result = await sut.market("coinbasepro_btc_usd");
				expect(result.id).to.equal("coinbasepro_btc_usd");
				expect(result.marketSymbol).to.equal("CoinbasePro:BTC/USD");
				expect(result.marketType).to.equal("Spot");
				expect(result.marketStatus).to.equal("Active");
				expect(result.exchangeSymbol).to.equal("CoinbasePro");
				expect(result.baseSymbol).to.equal("BTC");
				expect(result.quoteSymbol).to.equal("USD");
				expect(result.remoteId).to.equal("BTC-USD");
			});

			it("when doesn't exist", done => {
				expectReject(sut.market("coinbaser_btc_usd"), done);
			});
		});

		xdescribe(".candles()", () => {
			it("when valid returns candles", async () => {
				const result = await sut.candles(
					"coinbasepro_btc_usd",
					"2020-01-01T00:00:00.000Z",
					"2020-01-02T00:00:00.000Z",
					CandlePeriod._1h
				);
				expect(result.length).to.equal(24);
				expect(result[0][0]).to.equal("1577836800");
				expect(result[0][1]).to.equal("7165.72000000");
				expect(result[0][2]).to.equal("7165.72000000");
				expect(result[0][3]).to.equal("7136.05000000");
				expect(result[0][4]).to.equal("7150.35000000");
				expect(result[0][5]).to.equal("250.84981195");
			});

			it("when invalid market throws error", done => {
				expectReject(
					sut.candles(
						"coinbaser_btc_usd",
						"2020-01-01T00:00:00.000Z",
						"2020-01-02T00:00:00.000Z",
						CandlePeriod._1h
					),
					done
				);
			});

			it("when invalid start throws error", done => {
				expectReject(
					sut.candles(
						"coinbasepro_btc_usd",
						"2020-01-01",
						"2020-01-02T00:00:00.000Z",
						CandlePeriod._1h
					),
					done
				);
			});

			it("when invalid end throws error", done => {
				expectReject(
					sut.candles(
						"coinbasepro_btc_usd",
						"2020-01-01T00:00:00.000Z",
						"2020-01-02",
						CandlePeriod._1h
					),
					done
				);
			});

			it("when invalid period throws error", done => {
				expectReject(
					sut.candles(
						"coinbasepro_btc_usd",
						"2020-01-01T00:00:00.000Z",
						"2020-01-02T00:00:00.000Z",
						"_1s" as any
					),
					done
				);
			});
		});
	});
});
