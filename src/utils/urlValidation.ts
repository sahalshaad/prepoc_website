/**
 * Validates a URL to ensure it uses safe protocols (http, https).
 * Rejects javascript:, data:, and vbscript: URIs.
 * 
 * @param url The URL string to validate
 * @returns true if the URL is safe, false otherwise
 */
export function isSafeUrl(url: string | undefined | null): boolean {
  if (!url) return true; // Empty URLs are generally safe (render as empty href)

  try {
    const parsed = new URL(url);
    const protocol = parsed.protocol.toLowerCase();
    
    // Explicitly allow only http and https
    if (protocol === 'http:' || protocol === 'https:') {
      return true;
    }
    
    // Reject anything else
    return false;
  } catch (_error) {
    // If it can't be parsed as a full URL, it might be a relative path.
    // Ensure it doesn't start with javascript:, data:, etc.
    const lowerUrl = url.toLowerCase().trim();
    if (
      lowerUrl.startsWith('javascript:') ||
      lowerUrl.startsWith('data:') ||
      lowerUrl.startsWith('vbscript:')
    ) {
      return false;
    }
    
    // Allow relative paths (e.g. /about, #contact)
    if (lowerUrl.startsWith('/') || lowerUrl.startsWith('#') || lowerUrl.startsWith('?')) {
      return true;
    }

    // Default to false for completely invalid formats to be safe
    return false;
  }
}
