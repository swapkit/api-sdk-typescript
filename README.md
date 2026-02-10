# @swapkit/api-sdk-typescript

Type-safe TypeScript SDK for the [SwapKit API](https://docs.swapkit.dev). Auto-generated from live OpenAPI specs with full request/response typing for every endpoint.

## Installation

```bash
npm install @swapkit/api-sdk-typescript
# or
bun add @swapkit/api-sdk-typescript
```

## Quick Start

```typescript
import { createSwapKitClient } from "@swapkit/api-sdk-typescript";

const client = createSwapKitClient({ apiKey: "your-api-key" });

// Get a quote - fully typed request and response
const { data, error } = await client.POST("/v3/quote", {
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
  return;
}

// TypeScript knows the full shape: data.quoteId, data.routes, etc.
console.log(`Got ${data.routes.length} routes for quote ${data.quoteId}`);

// Pick the recommended route
const route = data.routes.find((r) => r.meta.tags.includes("RECOMMENDED"));
console.log(`Best rate: ${route?.buyAmount} BTC via ${route?.providers.join(", ")}`);
```

## Configuration

### `createSwapKitClient(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | **(required)** | Your SwapKit API key |
| `baseUrl` | `string` | `https://api.swapkit.dev` | API base URL override |
| `fetchOptions` | `ClientOptions` | `{}` | Additional options passed to `openapi-fetch` (e.g. custom `fetch`, `cache`) |

```typescript
// Production (default)
const client = createSwapKitClient({ apiKey: "sk_live_..." });

// Staging
const client = createSwapKitClient({
  apiKey: "sk_test_...",
  baseUrl: "https://dev-api.swapkit.dev",
});

// Custom fetch (e.g. for testing or logging)
const client = createSwapKitClient({
  apiKey: "sk_live_...",
  fetchOptions: { fetch: myCustomFetch },
});
```

## API Reference

All methods return `{ data, error, response }` where `data` is typed per endpoint and `error` is populated on non-2xx responses.

---

### Tokens & Providers

#### `GET /providers` — List swap providers

Returns all available swap providers with their supported chains and actions.

```typescript
const { data: providers } = await client.GET("/providers");

for (const p of providers ?? []) {
  console.log(`${p.name}: ${p.count} tokens, chains: ${p.enabledChainIds?.join(", ")}`);
}
```

**Response**: `Provider[]`

| Field | Type | Description |
|-------|------|-------------|
| `name` | `ProviderName` | Provider identifier (e.g. `"THORCHAIN"`) |
| `provider` | `ProviderName` | Same as name |
| `count` | `number` | Number of supported tokens |
| `displayName` | `string?` | Human-readable name |
| `enabledChainIds` | `ChainId[]?` | Chains the provider supports |
| `supportedActions` | `string[]?` | Actions like `"swap"`, `"addLiquidity"`, etc. |
| `logoURI` | `string?` | Provider logo URL |

---

#### `GET /tokens` — Get token lists

Returns token metadata grouped by provider.

```typescript
// All tokens
const { data } = await client.GET("/tokens");

// Filter by provider
const { data } = await client.GET("/tokens", {
  params: { query: { provider: "THORCHAIN" } },
});
```

**Query params**: `provider?: ProviderName`

**Response**: Array of token lists, each containing `tokens[]` with `identifier`, `chain`, `chainId`, `ticker`, `decimals`, `logoURI`, etc.

---

#### `GET /swapTo` — Available buy assets

Given a sell asset, returns all assets you can swap to.

```typescript
const { data: buyAssets } = await client.GET("/swapTo", {
  params: { query: { sellAsset: "ETH.ETH" } },
});
// buyAssets = ["BTC.BTC", "ETH.USDC-0xA0b8...", ...]
```

**Query params**: `sellAsset: string` (required)
**Response**: `string[]` — asset identifiers

---

#### `GET /swapFrom` — Available sell assets

Given a buy asset, returns all assets you can swap from.

```typescript
const { data: sellAssets } = await client.GET("/swapFrom", {
  params: { query: { buyAsset: "BTC.BTC" } },
});
```

**Query params**: `buyAsset: string` (required)
**Response**: `string[]` — asset identifiers

---

### Quoting

#### `POST /v3/quote` — Get swap quotes

Returns multiple swap routes with pricing, fees, estimated times.

```typescript
import type { QuoteRequest, QuoteResponse, Route } from "@swapkit/api-sdk-typescript";

const { data, error } = await client.POST("/v3/quote", {
  body: {
    sellAsset: "ETH.ETH",
    buyAsset: "BTC.BTC",
    sellAmount: "1",
    sourceAddress: "0xabc...",
    destinationAddress: "bc1xyz...",
    slippage: 3,               // percentage (default 3%)
    providers: ["THORCHAIN"],  // filter to specific providers
    cfBoost: true,             // Chainflip boost (BTC only)
    maxExecutionTime: 600,     // filter routes slower than 10min
  },
});

const bestRoute = data?.routes.find((r) => r.meta.tags.includes("RECOMMENDED"));
```

**Request body** (`QuoteRequest`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sellAsset` | `string` | Yes | Asset to sell (e.g. `"ETH.ETH"`) |
| `buyAsset` | `string` | Yes | Asset to buy (e.g. `"BTC.BTC"`) |
| `sellAmount` | `string` | Yes | Amount of sell asset |
| `sourceAddress` | `string` | No | Sender address |
| `destinationAddress` | `string` | No | Recipient address |
| `slippage` | `number` | No | Slippage tolerance (default 3%) |
| `providers` | `string[]` | No | Filter to specific providers |
| `cfBoost` | `boolean` | No | Enable Chainflip boost (BTC only) |
| `disableEstimate` | `boolean` | No | Skip on-chain estimation (default true) |
| `maxExecutionTime` | `number` | No | Max execution time in seconds |
| `affiliateFee` | `number` | No | Override affiliate fee in basis points |

**Response** (`QuoteResponse`):

| Field | Type | Description |
|-------|------|-------------|
| `quoteId` | `string` | Unique quote identifier |
| `routes` | `Route[]` | Available swap routes |
| `error` | `string?` | Error message if applicable |
| `providerErrors` | `ProviderError[]?` | Per-provider error details |

**Route** shape:

| Field | Type | Description |
|-------|------|-------------|
| `routeId` | `string` | Route identifier (used in `/v3/swap`) |
| `sellAsset` / `buyAsset` | `string` | Asset identifiers |
| `sellAmount` / `buyAmount` | `string` | Amounts |
| `expectedBuyAmount` | `string?` | Expected output before slippage |
| `providers` | `ProviderName[]` | Providers used in this route |
| `totalSlippageBps` | `number` | Total slippage in basis points |
| `estimatedTime` | `{ inbound?, swap?, outbound?, total }` | Time estimates in seconds |
| `fees` | `RouteFee[]` | Itemized fees (network, affiliate, etc.) |
| `legs` | `RouteLeg[]` | Individual swap steps |
| `warnings` | `RouteWarning[]` | Warnings (high slippage, etc.) |
| `meta` | `RouteMeta` | Tags (`CHEAPEST` / `FASTEST` / `RECOMMENDED`), asset metadata, provider-specific data |

---

### Swapping

#### `POST /v3/swap` — Execute a swap

Takes a `routeId` from a quote response and returns a ready-to-sign transaction.

```typescript
import type { SwapRequest, SwapResponse } from "@swapkit/api-sdk-typescript";

const { data: swap, error } = await client.POST("/v3/swap", {
  body: {
    routeId: route.routeId,                // from /v3/quote response
    sourceAddress: "0xabc...",
    destinationAddress: "bc1xyz...",
    disableBalanceCheck: false,
    disableEstimate: false,
    allowSmartContractSender: false,
    allowSmartContractReceiver: false,
    disableSecurityChecks: false,
    overrideSlippage: false,               // override slippage on quote refresh
    disableBuildTx: false,                 // set true for custom tx building
  },
});

// swap contains the same Route shape plus a pre-built transaction
if (swap?.tx) {
  // Sign and broadcast swap.tx
}
```

**Request body** (`SwapRequest`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `routeId` | `string` | Yes | Route ID from a `/v3/quote` response |
| `sourceAddress` | `string` | Yes | Sender address |
| `destinationAddress` | `string` | Yes | Recipient address |
| `disableBalanceCheck` | `boolean` | No | Skip balance validation |
| `disableEstimate` | `boolean` | No | Skip gas estimation |
| `allowSmartContractSender` | `boolean` | No | Allow SC sender |
| `allowSmartContractReceiver` | `boolean` | No | Allow SC receiver |
| `disableSecurityChecks` | `boolean` | No | Skip address screening |
| `overrideSlippage` | `boolean` | No | Override slippage on quote refresh |
| `disableBuildTx` | `boolean` | No | Skip tx building (for custom tx) |

**Response** (`SwapResponse`): Same shape as `Route` with transaction details populated.

---

### Tracking

#### `POST /track` — Track transaction status

Track a swap transaction by hash, deposit channel, or deposit address.

```typescript
import type { TrackResponse } from "@swapkit/api-sdk-typescript";

// Track by tx hash
const { data } = await client.POST("/track", {
  body: { hash: "0xabc...", chainId: "1" },
});

// Track by Chainflip deposit channel
const { data } = await client.POST("/track", {
  body: { depositChannelId: "123-Ethereum-456" },
});

// Track by deposit address
const { data } = await client.POST("/track", {
  body: { depositAddress: "0xdef..." },
});

console.log(`Status: ${data?.status}, Type: ${data?.type}`);
console.log(`${data?.fromAsset} -> ${data?.toAsset}`);
console.log(`Legs: ${data?.legs.length}`);
```

**Request body** (`TrackRequest`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hash` | `string` | No* | Transaction hash |
| `chainId` | `string` | No | Chain ID for the hash |
| `block` | `number` | No | Block number (required for Polkadot) |
| `depositChannelId` | `string` | No* | Chainflip deposit channel ID |
| `depositAddress` | `string` | No* | Deposit address |

*At least one of `hash`, `depositChannelId`, or `depositAddress` is required.

**Response** (`TrackResponse`):

| Field | Type | Description |
|-------|------|-------------|
| `hash` | `string` | Transaction hash |
| `status` | `TransactionStatus` | `"pending"` \| `"completed"` \| `"refunded"` \| `"failed"` \| ... |
| `trackingStatus` | `TrackingStatus?` | Detailed status: `"broadcasted"` \| `"mempool"` \| `"inbound"` \| `"swapping"` \| ... |
| `type` | `TransactionType` | `"swap"` \| `"deposit"` \| `"token_transfer"` \| ... |
| `fromAsset` / `toAsset` | `string` | Asset identifiers |
| `fromAmount` / `toAmount` | `string` | Amounts |
| `fromAddress` / `toAddress` | `string` | Addresses |
| `legs` | `TrackLeg[]` | Multi-leg breakdown |
| `transient` | `object?` | Live progress: `estimatedTimeToComplete`, streaming details |
| `meta` | `object?` | Provider, fees, explorer URL, affiliate info |

---

### Compliance

#### `POST /screen` — Screen addresses

Check addresses against sanctions lists and blacklists.

```typescript
const { data } = await client.POST("/screen", {
  body: {
    addresses: ["0xabc...", "bc1xyz..."],
    chains: ["ETH", "BTC"],
  },
});

if (data?.confirm) {
  console.log("Addresses are clear");
} else {
  console.log("Flagged:", { sanctioned: data?.isSanctioned, blacklisted: data?.isBlacklisted });
}
```

**Response** (`ScreenResponse`):

| Field | Type | Description |
|-------|------|-------------|
| `confirm` | `boolean` | `true` if addresses are clear |
| `isBlacklisted` | `boolean?` | On internal blacklist |
| `isRisky` | `boolean?` | Flagged as risky |
| `isSanctioned` | `boolean?` | On sanctions list |

---

### Chainflip

#### `POST /chainflip/broker/channel` — Open deposit channel

Open a Chainflip deposit channel for a swap.

```typescript
const { data } = await client.POST("/chainflip/broker/channel", {
  body: {
    destinationAddress: "0xabc...",
    sellAsset: { chain: "Bitcoin", asset: "BTC" },
    buyAsset: { chain: "Ethereum", asset: "ETH" },
    maxBoostFeeBps: 10,
    dcaParameters: { chunkInterval: 2, numberOfChunks: 5 },
    refundParameters: { refundAddress: "bc1...", retryDuration: 100 },
  },
});

console.log(`Deposit to: ${data?.depositAddress}`);
console.log(`Channel: ${data?.channelId}`);
console.log(`Explorer: ${data?.explorerUrl}`);
```

**Response** (`ChainflipChannelResponse`):

| Field | Type | Description |
|-------|------|-------------|
| `depositAddress` | `string` | Address to send funds to |
| `channelId` | `string` | Channel identifier |
| `explorerUrl` | `string` | Chainflip explorer link |

---

### Gas

#### `GET /gas` — Current gas prices

```typescript
const { data } = await client.GET("/gas");
```

#### `GET /gas/history` — Gas price history

```typescript
const { data } = await client.GET("/gas/history", {
  params: { query: { chainId: "1", timeFrame: "1d" } },
});
```

**Query params**: `chainId?: ChainId`, `timeFrame?: "1h" | "1d" | "1w" | "1m"`

---

### Pricing

#### `POST /price/cached-price` — Get token prices

```typescript
const { data: prices } = await client.POST("/price/cached-price", {
  body: {
    tokens: [{ identifier: "ETH.ETH" }, { identifier: "BTC.BTC" }],
    metadata: true,
  },
});

for (const p of prices ?? []) {
  console.log(`${p.identifier}: $${p.price_usd}`);
  if (p.cg) {
    console.log(`  24h change: ${p.cg.price_change_percentage_24h_usd}%`);
    console.log(`  Market cap: $${p.cg.market_cap}`);
  }
}
```

**Response** (`PriceResponse`): Array of price entries with optional CoinGecko metadata (`market_cap`, `total_volume`, `price_change_24h_usd`, `sparkline_in_7d`).

---

## Type Exports

The SDK exports convenience types for every endpoint. Import only what you need:

```typescript
import type {
  // Client
  SwapKitClientOptions,

  // Full path map (for advanced use)
  paths,

  // Quote (v3)
  QuoteRequest,
  QuoteResponse,
  Route,
  RouteLeg,
  RouteFee,
  RouteWarning,
  RouteMeta,

  // Swap (v3)
  SwapRequest,
  SwapResponse,

  // Track
  TrackRequest,
  TrackResponse,
  TrackLeg,

  // Tokens & Providers
  ProvidersResponse,
  Provider,
  TokensResponse,

  // Price
  PriceRequest,
  PriceResponse,

  // Screen
  ScreenRequest,
  ScreenResponse,

  // Gas
  GasResponse,
  GasHistoryResponse,

  // Chainflip
  ChainflipChannelRequest,
  ChainflipChannelResponse,

  // Enum-like union types
  ProviderName,       // "THORCHAIN" | "CHAINFLIP" | "UNISWAP_V3" | ...
  ChainId,            // "1" | "bitcoin" | "solana" | ...
  FeeType,            // "liquidity" | "network" | "affiliate" | ...
  TxType,             // "EVM" | "PSBT" | "COSMOS" | "SOLANA" | ...
  WarningCode,        // "highSlippage" | "insufficientBalance" | ...
  TrackingStatus,     // "broadcasted" | "mempool" | "swapping" | ...
  TransactionStatus,  // "pending" | "completed" | "refunded" | ...
  TransactionType,    // "swap" | "deposit" | "token_transfer" | ...
  RouteTag,           // "CHEAPEST" | "FASTEST" | "RECOMMENDED"
} from "@swapkit/api-sdk-typescript";
```

## Error Handling

Every endpoint returns `{ data, error, response }`. On non-2xx responses, `data` is `undefined` and `error` is populated:

```typescript
const { data, error, response } = await client.POST("/v3/quote", {
  body: { sellAsset: "ETH.ETH", buyAsset: "BTC.BTC", sellAmount: "1" },
});

if (error) {
  console.error(`HTTP ${response.status}:`, error.message);
  // error may also contain providerErrors with per-provider details
  return;
}

// data is fully typed here
console.log(data.quoteId);
```

## Full Example: Quote-to-Swap Flow

```typescript
import { createSwapKitClient } from "@swapkit/api-sdk-typescript";

const client = createSwapKitClient({ apiKey: "your-api-key" });

// 1. Get a quote
const { data: quote, error: quoteError } = await client.POST("/v3/quote", {
  body: {
    sellAsset: "ETH.ETH",
    buyAsset: "BTC.BTC",
    sellAmount: "1",
    sourceAddress: "0xYourAddress...",
    destinationAddress: "bc1YourBtcAddress...",
  },
});

if (quoteError || !quote) throw new Error("Quote failed");

// 2. Pick the best route
const route = quote.routes.find((r) => r.meta.tags.includes("RECOMMENDED")) ?? quote.routes[0];
if (!route) throw new Error("No routes available");

console.log(`Swapping ${route.sellAmount} ETH for ~${route.buyAmount} BTC`);
console.log(`Via: ${route.providers.join(" -> ")}`);
console.log(`Estimated time: ${route.estimatedTime?.total}s`);
console.log(`Fees: ${route.fees.map((f) => `${f.type}: ${f.amount} ${f.asset}`).join(", ")}`);

// 3. Execute the swap
const { data: swap, error: swapError } = await client.POST("/v3/swap", {
  body: {
    routeId: route.routeId,
    sourceAddress: "0xYourAddress...",
    destinationAddress: "bc1YourBtcAddress...",
  },
});

if (swapError || !swap) throw new Error("Swap failed");

// 4. Sign and broadcast swap.tx with your wallet...
// (wallet-specific code here)

// 5. Track the transaction
const { data: status } = await client.POST("/track", {
  body: { hash: "0xBroadcastedTxHash...", chainId: "1" },
});

console.log(`Status: ${status?.status}`);  // "pending" | "swapping" | "completed" | ...
```

## Development

### Regenerate types from live API

```bash
bun run generate:sdk

# Point to a different API
API_BASE_URL=http://localhost:3000 bun run generate:sdk
```

### Run tests

```bash
bun run test:sdk
```

### Build for publishing

```bash
bun run build:sdk    # ESM + CJS + declarations
cd tooling/sdk && npm publish
```
