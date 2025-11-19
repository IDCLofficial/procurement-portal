/**
 * Generates a unique certificate ID in the format: CERT-YYYY-XXXX
 * Where YYYY is the current year and XXXX is a sequential number
 * Example: CERT-2025-0001
 */
export function generateCertificateId(sequenceNumber: number): string {
  const currentYear = new Date().getFullYear();
  const paddedSequence = sequenceNumber.toString().padStart(4, '0');
  return `CERT-${currentYear}-${paddedSequence}`;
}

/**
 * Extracts the sequence number from a certificate ID
 * Example: CERT-2025-0001 -> 1
 */
export function extractSequenceFromCertificateId(certificateId: string): number {
  const parts = certificateId.split('-');
  if (parts.length === 3) {
    return parseInt(parts[2], 10);
  }
  return 0;
}
