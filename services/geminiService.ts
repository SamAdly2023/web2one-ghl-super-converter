
import { GoogleGenAI, Type } from "@google/genai";
import { RebrandingInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function optimizeHtmlForGHL(
  rawHtml: string, 
  originalUrl: string, 
  rebrand?: RebrandingInfo
): Promise<string> {
  const model = "gemini-3-pro-preview";

  // Fixed: Escaped nested backticks to prevent premature termination of the template literal
  const systemInstruction = `
    You are an Elite Web Architect specializing in High-Fidelity Static Page Reconstruction.
    Your goal is to transform a website's source code into a single, bulletproof GHL-compatible HTML file.
    CRITICAL: Output ONLY the raw HTML code. Do NOT include markdown blocks (\`\`\`html), backticks, or any conversational text.
  `;

  // Provide a larger slice of HTML to catch content in JS-heavy pages
  const sourceContent = rawHtml.substring(0, 150000);

  const rebrandPrompt = rebrand ? `
    REBRANDING & PERSONALIZATION:
    - Replace the main logo/identity with: "${rebrand.logoUrl || 'original'}".
    - Update all text instances of the brand name to: "${rebrand.brandName || 'original'}".
    - Change all primary links (buttons, nav, footer) to: "${rebrand.websiteLink || '#'}".
  ` : "";

  const prompt = `
    URGENT TASK: Clone the website ${originalUrl} for GoHighLevel.
    
    PREVENTING BLANK PAGES & OVERLAPPING (CORE FIXES):
    1. STATIC RECONSTRUCTION: If the source is a dynamic app (React/Vue), do not just copy script tags. Reconstruct the VISUAL SECTIONS (Hero, About, Gallery, Contact, Footer) as static HTML components with high-end CSS.
    2. HERO & LAYOUT: 
       - Ensure the Hero section uses "min-height: 100vh !important" or "height: auto !important".
       - NEVER use "overflow: hidden" on sections that contain content; this causes blank/missing sections.
       - Use "display: block" or "display: flex" with proper wrapping.
    3. TEXT OVERLAPPING: Use modern Flexbox/Grid for layout. Ensure containers have enough padding and font sizes are responsive.
    
    GHL FULL-WIDTH INJECTION (MANDATORY):
    Every clone must have this reset at the top of its <style> block:
    <style>
      * { box-sizing: border-box !important; }
      body, html { margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; width: 100% !important; }
      #ghl-clone-container {
        width: 100vw !important;
        margin-left: calc(-50vw + 50%) !important;
        margin-right: calc(-50vw + 50%) !important;
        padding: 0 !important;
        position: relative !important;
        left: 0 !important;
        right: 0 !important;
        background: transparent !important;
      }
      section { position: relative !important; width: 100% !important; clear: both !important; }
    </style>

    ASSET HANDLING:
    - Prepend "${originalUrl}" to all relative URLs for images, icons, and backgrounds.
    - If a section appears empty in the source (client-side rendered), use the rebranding info and site title to reconstruct a beautiful professional section that matches the target's vibe.

    ${rebrandPrompt}

    SOURCE HTML DATA:
    ${sourceContent}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 15000 }, // Max reasoning for complex layout deduction
        temperature: 0.1,
      },
    });

    // Accessing the text property directly as per @google/genai guidelines
    let result = response.text || "";
    result = result.trim();
    
    // Cleaning AI artifacts like markdown code blocks
    result = result.replace(/^```html\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/m, "");
    
    const firstTag = result.indexOf('<');
    const lastTag = result.lastIndexOf('>');
    
    if (firstTag !== -1 && lastTag !== -1) {
      result = result.substring(firstTag, lastTag + 1);
    }

    // Wrap the result in the special container if not already there
    if (!result.includes('id="ghl-clone-container"')) {
      result = `<div id="ghl-clone-container">${result}</div>`;
    }

    return result;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("The site is too complex or protected. Our engine is attempting to scale its reconstruction—please try again with a different URL.");
  }
}
