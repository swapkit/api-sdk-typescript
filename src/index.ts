export { configureSwapKit, client } from "./config";
export type { SwapKitClientOptions } from "./config";

// Re-export all generated types
export type * from "./types";

// Re-export all generated SDK functions
export * from "./sdk";

// ---------------------------------------------------------------------------
// SwapKitService — single unified service class with all SDK methods
//
// Maps generated path-derived names to user-friendly method names.
// ---------------------------------------------------------------------------

import {
  getProviders,
  getTokens,
  getSwapTo,
  getSwapFrom,
  postV3Quote,
  postV3Swap,
  postTrack,
  postScreen,
  getGas,
  getGasHistory,
  postPriceCachedPrice,
  postChainflipBrokerChannel,
} from "./sdk";

export class SwapKitService {
  static getProviders = getProviders;
  static getTokens = getTokens;
  static getSwapTo = getSwapTo;
  static getSwapFrom = getSwapFrom;
  static getQuote = postV3Quote;
  static getSwap = postV3Swap;
  static trackTransaction = postTrack;
  static screenAddress = postScreen;
  static getGasPrices = getGas;
  static getGasHistory = getGasHistory;
  static getCachedPrice = postPriceCachedPrice;
  static createBrokerChannel = postChainflipBrokerChannel;
}

// ---------------------------------------------------------------------------
// Backward-compatible service namespace aliases (deprecated)
// ---------------------------------------------------------------------------

/** @deprecated Use `SwapKitService` instead */
export const TokenlistService = {
  getProviders,
  getTokens,
  getSwapTo,
  getSwapFrom,
} as const;

/** @deprecated Use `SwapKitService` instead */
export const QuoteService = {
  getQuote: postV3Quote,
} as const;

/** @deprecated Use `SwapKitService` instead */
export const SwapService = {
  getSwap: postV3Swap,
} as const;

/** @deprecated Use `SwapKitService` instead */
export const TrackService = {
  trackTransaction: postTrack,
} as const;

/** @deprecated Use `SwapKitService` instead */
export const ScreenService = {
  screenAddress: postScreen,
} as const;

/** @deprecated Use `SwapKitService` instead */
export const GasService = {
  getGasPrices: getGas,
  getGasHistory,
} as const;

/** @deprecated Use `SwapKitService` instead */
export const PriceService = {
  getCachedPrice: postPriceCachedPrice,
} as const;

/** @deprecated Use `SwapKitService` instead */
export const ChainflipService = {
  createBrokerChannel: postChainflipBrokerChannel,
} as const;
