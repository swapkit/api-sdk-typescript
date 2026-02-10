export { createSwapKitClient } from "./client";
export type { SwapKitClientOptions } from "./client";
export type { paths } from "./generated/api";
import type { paths } from "./generated/api";
/** Extracts the JSON response body for a given path + method + status */
type JsonBody<P extends keyof paths, M extends keyof paths[P], S extends string = "200"> = paths[P][M] extends {
    responses: infer R;
} ? R extends Record<S, {
    content: {
        "application/json": infer B;
    };
}> ? B : never : never;
/** Extracts the JSON request body for a given path + method */
type JsonRequest<P extends keyof paths, M extends keyof paths[P]> = paths[P][M] extends {
    requestBody?: {
        content: {
            "application/json": infer B;
        };
    };
} ? B : paths[P][M] extends {
    requestBody: {
        content: {
            "application/json": infer B;
        };
    };
} ? B : never;
export type QuoteRequest = JsonRequest<"/v3/quote", "post">;
export type QuoteResponse = JsonBody<"/v3/quote", "post">;
export type Route = QuoteResponse["routes"][number];
export type RouteLeg = Route["legs"][number];
export type RouteFee = Route["fees"][number];
export type RouteWarning = Route["warnings"][number];
export type RouteMeta = Route["meta"];
export type SwapRequest = JsonRequest<"/v3/swap", "post">;
export type SwapResponse = JsonBody<"/v3/swap", "post">;
export type TrackRequest = JsonRequest<"/track", "post">;
export type TrackResponse = JsonBody<"/track", "post">;
export type TrackLeg = TrackResponse["legs"][number];
export type ProvidersResponse = JsonBody<"/providers", "get">;
export type Provider = ProvidersResponse extends (infer P)[] ? P : never;
export type TokensResponse = JsonBody<"/tokens", "get">;
export type PriceRequest = JsonRequest<"/price/cached-price", "post">;
export type PriceResponse = JsonBody<"/price/cached-price", "post">;
export type ScreenRequest = JsonRequest<"/screen", "post">;
export type ScreenResponse = JsonBody<"/screen", "post">;
export type GasResponse = JsonBody<"/gas", "get">;
export type GasHistoryResponse = JsonBody<"/gas/history", "get">;
export type ChainflipChannelRequest = JsonRequest<"/chainflip/broker/channel", "post">;
export type ChainflipChannelResponse = JsonBody<"/chainflip/broker/channel", "post">;
export type ProviderName = Route["providers"][number];
export type ChainId = NonNullable<Provider["enabledChainIds"]>[number];
export type FeeType = RouteFee["type"];
export type TxType = NonNullable<SwapResponse["txType"]>;
export type WarningCode = RouteWarning["code"];
export type TrackingStatus = NonNullable<TrackResponse["trackingStatus"]>;
export type TransactionStatus = TrackResponse["status"];
export type TransactionType = TrackResponse["type"];
export type RouteTag = RouteMeta["tags"][number];
