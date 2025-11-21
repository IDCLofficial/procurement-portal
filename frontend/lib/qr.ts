import QRCode from 'qrcode';

/**
 * Generate a QR code as a PNG data URL from a given URL
 * @param url - The URL to encode in the QR code
 * @param options - Optional QR code generation options
 * @returns Promise<string> - Data URL of the generated QR code PNG
 */
export async function generateQRCode(
    url: string,
    options?: {
        width?: number;
        margin?: number;
        color?: {
            dark?: string;
            light?: string;
        };
    }
): Promise<string> {
    try {
        const qrOptions = {
            width: options?.width || 300,
            margin: options?.margin || 2,
            color: {
                dark: options?.color?.dark || '#000000',
                light: options?.color?.light || '#FFFFFF',
            },
            errorCorrectionLevel: 'M' as const,
        };

        const dataUrl = await QRCode.toDataURL(url, qrOptions);
        return dataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
}

/**
 * Generate a QR code as a canvas element
 * @param url - The URL to encode in the QR code
 * @param canvas - Canvas element to render to
 * @param options - Optional QR code generation options
 */
export async function generateQRCodeToCanvas(
    url: string,
    canvas: HTMLCanvasElement,
    options?: {
        width?: number;
        margin?: number;
        color?: {
            dark?: string;
            light?: string;
        };
    }
): Promise<void> {
    try {
        const qrOptions = {
            width: options?.width || 300,
            margin: options?.margin || 2,
            color: {
                dark: options?.color?.dark || '#000000',
                light: options?.color?.light || '#FFFFFF',
            },
            errorCorrectionLevel: 'M' as const,
        };

        await QRCode.toCanvas(canvas, url, qrOptions);
    } catch (error) {
        console.error('Error generating QR code to canvas:', error);
        throw new Error('Failed to generate QR code');
    }
}
