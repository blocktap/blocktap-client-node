export type CurrencyFilter = {
	/**
	 * Currency symbol to search for. Wildcards are supported with `%`.
	 * For example BC% or %BTC%.
	 */
	currencySymbol?: string;

	/**
	 * Currency name to search for. Wildcards are supported with `%`.
	 * For example Bit% or %Bitcoin%.
	 */
	currencyName?: string;

	/**
	 * Filter for active or inactive currencies.
	 */
	isActive?: boolean;
};
