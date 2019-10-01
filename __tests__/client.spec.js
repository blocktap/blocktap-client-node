const { expect } = require('chai');
const { BlocktapClient } = require('../src');
const { RequestError } = require('../src/request-error');

const fixtures = {};

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

describe('BlocktapClient', () => {
	describe('not authenticated', () => {
		describe('.query', () => {
			it('should return results of valid query', async () => {
				let sut = new BlocktapClient();
				let result = await sut.query({ query: fixtures.basicQuery });
				expect(result.data.market.id).to.equal('binance_btc_usdt');
			});

			it('should return results of bad query', async () => {
				let sut = new BlocktapClient();
				let result = await sut.query({ query: fixtures.badQuery });
				expect(result.errors.length).to.be.greaterThan(0);
			});

			it('should reject on invalid request', () => {
				let sut = new BlocktapClient();
				sut.path = '/graphqll';
				return sut
					.query({ query: fixtures.basicQuery })
					.then(() => {
						throw new Error('Should not succeed');
					})
					.catch(err => {
						expect(err).to.be.an.instanceOf(RequestError);
					});
			});

			it('should return null for restricted data', async () => {
				let sut = new BlocktapClient();
				let result = await sut.query({ query: fixtures.restrictedData });
				expect(result.data.market.ohlcv).to.be.null;
			});
		});
	});
});
