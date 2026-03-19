import { parse } from 'tldts';

const castStringToNumber = (value: string | number) => {
  if (typeof value === 'number') return value;
  const num = Number(value);
  // Check if the conversion is successful and not NaN (but allow "0" to cast to 0)
  return value !== '' && !Number.isNaN(num) ? num : value;
};

/**
 * Cleans a referrer URL to extract just the domain name (e.g., "google.com" -> "google")
 * Uses tldts to properly handle multi-part TLDs and extract the domain without the TLD
 */
const cleanReferrer = (referrer: string | undefined): string | undefined => {
  if (!referrer || typeof referrer !== 'string' || referrer.trim() === '') {
    return undefined;
  }

  try {
    const parsed = parse(referrer);
    
    // Skip IP addresses - we only want domain names
    if (parsed.isIp) {
      return undefined;
    }

    // domainWithoutSuffix gives us the domain name without the TLD
    // e.g., "google" from "google.com", "example" from "subdomain.example.com"
    if (parsed.domainWithoutSuffix) {
      return parsed.domainWithoutSuffix;
    }

    // Fallback: if domainWithoutSuffix is not available, try using domain
    // and extract the part before the TLD manually
    if (parsed.domain) {
      const parts = parsed.domain.split('.');
      if (parts.length >= 2) {
        return parts[0];
      }
    }

    return undefined;
  } catch (e) {
    // If parsing fails, return undefined
    return undefined;
  }
};

export { castStringToNumber, cleanReferrer };
