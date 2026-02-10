import createClient, { type ClientOptions } from "openapi-fetch";
import type { paths } from "./generated/api";

export interface SwapKitClientOptions {
  apiKey: string;
  baseUrl?: string;
  fetchOptions?: Omit<ClientOptions, "baseUrl" | "headers">;
}

export function createSwapKitClient(options: SwapKitClientOptions) {
  const { apiKey, baseUrl = "https://api.swapkit.dev", fetchOptions } = options;
  return createClient<paths>({
    baseUrl,
    headers: { "x-api-key": apiKey },
    ...fetchOptions,
  });
}
