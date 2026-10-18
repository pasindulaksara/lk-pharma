
const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || ""
  ).replace(/\/+$/, "");
  
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured");
  }
  

  export function resolveAssetUrl(
    path: string | null | undefined
  ): string {
    if (!path?.trim()) return "";
  
    const value = path.trim();
  
    // Manufacturer image URLs:
    // Preserve existing %20 and encode actual spaces.
    if (/^https?:\/\//i.test(value)) {
      return value.replace(/ /g, "%20");
    }
  
    // Uploaded images stored on our PHP backend.
    const baseUrl = (
      import.meta.env.VITE_API_BASE_URL || ""
    ).replace(/\/+$/, "");
  
    if (!baseUrl) return "";
  
    return `${baseUrl}/${value.replace(/^\/+/, "")}`;
  }
  
  
  export async function apiGet<T>(
    action: string,
    params: object = {},
    signal?: AbortSignal
  ): Promise<T> {
    const url = new URL(`${API_BASE_URL}/`);
  
    url.searchParams.set("action", action);
  
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "omit",
      signal,
    });
  
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  
    const result = await response.json();
  
    if (!result.success) {
      throw new Error(result.message || "API request failed");
    }
  
    return result as T;
  }
  