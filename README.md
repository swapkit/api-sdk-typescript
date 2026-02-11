# @swapkit/api-sdk-typescript

Type-safe TypeScript SDK for the [SwapKit API](https://docs.swapkit.dev). Auto-generated from OpenAPI specs with named domain types and full request/response typing.

## Installation

```bash
npm install @swapkit/api-sdk-typescript
# or
bun add @swapkit/api-sdk-typescript
```

## Quick Start

```typescript
import { configureSwapKit, SwapKitService } from "@swapkit/api-sdk-typescript";

// Configure once at startup
configureSwapKit({ apiKey: "your-api-key" });

// Use named service methods — fully typed
const { data: providers } = await SwapKitService.getProviders();

const { data: quote, error } = await SwapKitService.getQuote({
  body: {
    sellAsset: "ETH.ETH",
    buyAsset: "BTC.BTC",
    sellAmount: "1",
    sourceAddress: "0x...",
    destinationAddress: "bc1...",
  },
});

if (error) {
  console.error("Quote failed:", error);
} else {
  console.log(`Got ${quote.routes.length} routes for quote ${quote.quoteId}`);
}
```

## Configuration

### `configureSwapKit(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | **(required)** | Your SwapKit API key |
| `baseUrl` | `string` | `https://api.swapkit.dev` | API base URL override |

```typescript
// Production (default)
configureSwapKit({ apiKey: "sk_live_..." });

// Staging
configureSwapKit({
  apiKey: "sk_test_...",
  baseUrl: "https://dev-api.swapkit.dev",
});
```

## SwapKitService

All API methods are available as static methods on the `SwapKitService` class:

| Method | HTTP | Endpoint |
|--------|------|----------|
| `getProviders()` | GET | `/providers` |
| `getTokens({ query? })` | GET | `/tokens` |
| `getSwapTo({ query })` | GET | `/swapTo` |
| `getSwapFrom({ query })` | GET | `/swapFrom` |
| `getQuote({ body })` | POST | `/v3/quote` |
| `getSwap({ body })` | POST | `/v3/swap` |
| `trackTransaction({ body })` | POST | `/track` |
| `screenAddress({ body })` | POST | `/screen` |
| `getGasPrices()` | GET | `/gas` |
| `getGasHistory({ query? })` | GET | `/gas/history` |
| `getCachedPrice({ body })` | POST | `/price/cached-price` |
| `createBrokerChannel({ body })` | POST | `/chainflip/broker/channel` |

### Examples

```typescript
// Get available providers
const { data: providers } = await SwapKitService.getProviders();

// Get tokens for a provider
const { data: tokens } = await SwapKitService.getTokens({
  query: { provider: "THORCHAIN" },
});

// Get available buy assets for a sell asset
const { data: buyAssets } = await SwapKitService.getSwapTo({
  query: { sellAsset: "ETH.ETH" },
});

// Get a quote
const { data, error } = await SwapKitService.getQuote({
  body: {
    sellAsset: "ETH.ETH",
    buyAsset: "BTC.BTC",
    sellAmount: "1",
    slippage: 3,
    providers: ["THORCHAIN"],
  },
});

// Execute a swap
const { data: swap } = await SwapKitService.getSwap({
  body: {
    routeId: route.routeId,
    sourceAddress: "0xabc...",
    destinationAddress: "bc1xyz...",
  },
});

// Track a transaction
const { data: status } = await SwapKitService.trackTransaction({
  body: { hash: "0xabc...", chainId: "1" },
});

// Screen an address
const { data: screen } = await SwapKitService.screenAddress({
  body: { addresses: ["0xabc..."], chains: ["ETH"] },
});

// Get gas prices
const { data: gas } = await SwapKitService.getGasPrices();

// Get cached token prices
const { data: prices } = await SwapKitService.getCachedPrice({
  body: { tokens: [{ identifier: "ETH.ETH" }], metadata: true },
});
```

## Full Example: Quote-to-Swap Flow

```typescript
import { configureSwapKit, SwapKitService } from "@swapkit/api-sdk-typescript";

configureSwapKit({ apiKey: "your-api-key" });

// 1. Get a quote
const { data: quote } = await SwapKitService.getQuote({
  body: {
    sellAsset: "ETH.ETH",
    buyAsset: "BTC.BTC",
    sellAmount: "1",
    sourceAddress: "0xYourAddress...",
    destinationAddress: "bc1YourBtcAddress...",
  },
});

if (!quote) throw new Error("Quote failed");

// 2. Pick the best route
const route = quote.routes.find((r) => r.meta.tags.includes("RECOMMENDED")) ?? quote.routes[0];

// 3. Execute the swap
const { data: swap } = await SwapKitService.getSwap({
  body: {
    routeId: route.routeId,
    sourceAddress: "0xYourAddress...",
    destinationAddress: "bc1YourBtcAddress...",
  },
});

// 4. Track the transaction
const { data: status } = await SwapKitService.trackTransaction({
  body: { hash: "0xBroadcastedTxHash...", chainId: "1" },
});

console.log(`Status: ${status?.status}`);
```

## Direct Function Access

You can also import SDK functions directly instead of using the service class:

```typescript
import { postV3Quote, postV3Swap, postTrack } from "@swapkit/api-sdk-typescript";
```

## Development

### Regenerate types

```bash
bun run extract:sdk
LOCAL_SPECS_DIR=/tmp/swapkit-specs bun run generate:sdk
```

### Run tests

```bash
bun run test:sdk
```

### Build for publishing

```bash
bun run build:sdk
```
