import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function updateSearchParam(key: string, value: string) {
  const url = new URL(window.location.toString());

  if (url.searchParams.get(key) === value) {
    return null;
  }
  url.searchParams.set(key, value);

  window.history.pushState({}, "", url.toString());
}

export function removeSearchParam(key: string) {
  const url = new URL(window.location.href);
  url.searchParams.delete(key);

  window.history.pushState({}, "", url.toString());
}

interface UrlValidationOptions {
  requireProtocol?: boolean;
  allowedProtocols?: string[];
}

export function isUrl(value: string, options: UrlValidationOptions = { requireProtocol: false, allowedProtocols: ['http', 'https'] }): boolean {
  const { requireProtocol = false, allowedProtocols = ['http', 'https'] } = options;

  // Basic validation checks
  if (!value || typeof value !== 'string') return false;

  // Trim whitespace
  value = value.trim();

  // Check for whitespace in the middle (URLs shouldn't have spaces)
  if (/\s/.test(value)) return false;

  // Check for obviously invalid patterns
  if (value.endsWith('.') || value.startsWith('.')) return false;

  try {
    // If protocol not required, try adding one first
    const testString = requireProtocol
      ? value
      : (value.match(/^[a-z]+:\/\//i) ? value : `https://${value}`);

    const url = new URL(testString);

    // Check if protocol is allowed
    if (allowedProtocols && allowedProtocols.length > 0) {
      if (!allowedProtocols.includes(url.protocol.replace(':', ''))) {
        return false;
      }
    }

    // Additional validation for hostname
    const hostname = url.hostname;

    // Hostname should have at least one dot (except for localhost)
    if (!hostname.includes('.') && hostname !== 'localhost') return false;

    // Hostname shouldn't be too short or just a dot
    if (hostname.length < 3) return false;

    // Check for valid TLD (at least 2 characters after the last dot)
    const parts = hostname.split('.');
    const tld = parts[parts.length - 1];
    if (tld.length < 2) return false;

    // Hostname parts shouldn't be empty
    if (parts.some(part => !part)) return false;

    return true;
  } catch {
    return false;
  }
}