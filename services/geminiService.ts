
import { RebrandingInfo } from "../types";

// When using Cloud Functions for Gemini, call the function endpoint.
const FUNCTIONS_GEMINI_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FUNCTIONS_GEMINI_URL)
  || process.env.FUNCTIONS_GEMINI_URL
  || 'http://localhost:5001/your-project/us-central1/generate';

export async function optimizeHtmlForGHL(
  rawHtml: string,
  originalUrl: string,
  rebrand?: RebrandingInfo
): Promise<string> {
  const res = await fetch(FUNCTIONS_GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawHtml, originalUrl, rebrand })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Function error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.html;
}
