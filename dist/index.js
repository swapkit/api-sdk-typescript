// src/client.ts
import createClient from "openapi-fetch";
function createSwapKitClient(options) {
  const { apiKey, baseUrl = "https://api.swapkit.dev", fetchOptions } = options;
  return createClient({
    baseUrl,
    headers: { "x-api-key": apiKey },
    ...fetchOptions
  });
}
export {
  createSwapKitClient
};
