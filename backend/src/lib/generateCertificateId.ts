/**
 * Generates a unique certificate ID in the format: IMO-CONT-YYYY-XXXXXX
 * Where YYYY is the current year and XXXXXX is a random 6-character alphanumeric code
 * Example: IMO-CONT-2025-A1B2C3
 */
export function generateCertificateId(): string {
  const currentYear = new Date().getFullYear();
  
  // Generate random 6-character alphanumeric code
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let alphanumeric = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    alphanumeric += chars[randomIndex];
  }
  
  return `IMO-CONT-${currentYear}-${alphanumeric}`;
}

/**
 * Extracts the sequence number from a certificate ID
 * Example: IMO-CONT-2025-A1B2C3 -> sequence number
 */
export function extractSequenceFromCertificateId(certificateId: string): number {
  const parts = certificateId.split('-');
  if (parts.length === 4) {
    const alphanumeric = parts[3];
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Convert base-36 back to decimal
    let num = 0;
    for (let i = 0; i < alphanumeric.length; i++) {
      const charIndex = chars.indexOf(alphanumeric[i]);
      if (charIndex === -1) return 0;
      num = num * 36 + charIndex;
    }
    return num;
  }
  return 0;
}
