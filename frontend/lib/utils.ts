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

export function isUrl(value: string, options: UrlValidationOptions = {requireProtocol: false, allowedProtocols: ['http', 'https']}): boolean {
  const { requireProtocol = true, allowedProtocols } = options;

  try {
    // If protocol not required, try adding one first
    const testString = requireProtocol
      ? value
      : (value.match(/^[a-z]+:\/\//i) ? value : `https://${value}`);

    const url = new URL(testString);

    // Check if protocol is allowed
    if (allowedProtocols && allowedProtocols.length > 0) {
      return allowedProtocols.includes(url.protocol.replace(':', ''));
    }

    return true;
  } catch {
    return false;
  }
}