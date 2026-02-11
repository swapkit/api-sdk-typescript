import { client } from "./client";

export interface SwapKitClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export function configureSwapKit(options: SwapKitClientOptions) {
  const { apiKey, baseUrl = "https://api.swapkit.dev" } = options;
  client.setConfig({
    baseUrl,
    headers: { "x-api-key": apiKey },
  });
}

export { client };
