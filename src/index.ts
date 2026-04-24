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
  createBrokerChannel,
  executeSwap,
  getCachedPrice,
  getGasHistory,
  getGasPrices,
  getProviders,
  getQuote,
  getSwapFromAssets,
  getSwapToAssets,
  getTokens,
  screenAddress,
  trackTransaction,
} from "./sdk";

export class SwapKitService {
  static getProviders = getProviders;
  static getTokens = getTokens;
  static getSwapTo = getSwapToAssets;
  static getSwapFrom = getSwapFromAssets;
  static getQuote = getQuote;
  static getSwap = executeSwap;
  static trackTransaction = trackTransaction;
  static screenAddress = screenAddress;
  static getGasPrices = getGasPrices;
  static getGasHistory = getGasHistory;
  static getCachedPrice = getCachedPrice;
  static createBrokerChannel = createBrokerChannel;
}

// ---------------------------------------------------------------------------
// Backward-compatible service namespace aliases (deprecated)
// ---------------------------------------------------------------------------

/** @deprecated Use `SwapKitService` instead */
export const TokenlistService = {
  getProviders,
  getTokens,
  getSwapTo: getSwapToAssets,
  getSwapFrom: getSwapFromAssets,
} as const;

/** @deprecated Use `SwapKitService` instead */
export const QuoteService = {
  getQuote,
} as const;

/** @deprecated Use `SwapKitService` instead */
export const SwapService = {
  getSwap: executeSwap,
} as const;

/** @deprecated Use `SwapKitService` instead */
export const TrackService = {
  trackTransaction,
} as const;

/** @deprecated Use `SwapKitService` instead */
export const ScreenService = {
  screenAddress,
} as const;

/** @deprecated Use `SwapKitService` instead */
export const GasService = {
  getGasPrices,
  getGasHistory,
} as const;

/** @deprecated Use `SwapKitService` instead */
export const PriceService = {
  getCachedPrice,
} as const;

/** @deprecated Use `SwapKitService` instead */
export const ChainflipService = {
  createBrokerChannel,
} as const;
