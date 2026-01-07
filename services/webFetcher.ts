
/**
 * Fetches the HTML content of a website using multiple CORS proxy fallbacks.
 * This version is optimized to detect "empty shells" often found in SPA sites.
 */
export async function fetchWebsiteHtml(url: string): Promise<string> {
  // Validate URL format
  try {
    const parsed = new URL(url);
    if (!parsed.protocol.startsWith('http')) throw new Error();
  } catch {
    throw new Error("Invalid URL format. Please include http:// or https://");
  }

  const encodedUrl = encodeURIComponent(url);
  
  const proxies = [
    { url: `https://corsproxy.io/?url=${encodedUrl}`, type: 'text' },
    { url: `https://api.allorigins.win/get?url=${encodedUrl}&_ts=${Date.now()}`, type: 'json' },
    { url: `https://api.codetabs.com/v1/proxy?quest=${encodedUrl}`, type: 'text' }
  ];

  for (const proxy of proxies) {
    try {
      const response = await fetch(proxy.url);
      if (response.ok) {
        let content = '';
        if (proxy.type === 'json') {
          const data = await response.json();
          content = data.contents;
        } else {
          content = await response.text();
        }

        // Sanity check: Does the content look like actual HTML with body content?
        // JS sites often return just a shell < 2000 chars. 
        // We accept it but warn the AI to reconstruct it.
        if (content && content.includes('<html') && content.length > 300) {
          return content;
        }
      }
    } catch (e) {
      console.warn(`Proxy ${proxy.url} failed, moving to next...`);
    }
  }

  throw new Error(
    "Target site is heavily protected or proxies are down. Please check if the URL is correct and public."
  );
}
