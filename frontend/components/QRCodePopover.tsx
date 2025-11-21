'use client';

import { useState, useEffect, useCallback } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FaQrcode, FaDownload } from 'react-icons/fa';
import { generateQRCode } from '@/lib/qr';
import { toast } from 'sonner';
import Image from 'next/image';
import { FaPlus } from 'react-icons/fa6';

interface QRCodePopoverProps {
    url: string;
    label?: string;
    buttonVariant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
    buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function QRCodePopover({
    url,
    label = 'Show QR',
    buttonVariant = 'outline',
    buttonSize = 'default'
}: QRCodePopoverProps) {
    const [qrCode, setQrCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const generateQR = useCallback(async () => {
        setIsLoading(true);
        try {
            const qrDataUrl = await generateQRCode(url, {
                width: 300,
                margin: 2,
            });
            setQrCode(qrDataUrl);
        } catch (error) {
            toast.error('Failed to generate QR code');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [url]);

    useEffect(() => {
        if (isOpen && !qrCode) {
            generateQR();
        }
    }, [isOpen, qrCode, generateQR]);

    const handleDownload = () => {
        if (!qrCode) return;

        const link = document.createElement('a');
        link.href = qrCode;
        link.download = 'qr-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('QR code downloaded successfully');
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={buttonVariant}
                    size={buttonSize}
                    className="cursor-pointer active:scale-95 transition-transform duration-300"
                >
                    <FaQrcode className="h-4 w-4" />
                    <span>{label}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">QR Code</h4>
                        <p className="text-xs text-gray-500">
                            Scan this code to verify the certificate
                        </p>
                    </div>

                    <div className="flex justify-center items-center bg-white p-4 rounded-lg border">
                        {isLoading ? (
                            <div className="w-[300px] h-[300px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-green"></div>
                            </div>
                        ) : qrCode ? (
                            <div className='relative'>
                                <span className='absolute'><FaPlus/></span>
                                <span className='absolute right-0'><FaPlus/></span>
                                <span className='absolute bottom-0'><FaPlus/></span>
                                <span className='absolute bottom-0 right-0'><FaPlus/></span>
                                <Image
                                    src={qrCode}
                                    alt="QR Code"
                                    unoptimized
                                    priority
                                    objectFit="contain"
                                    width={300}
                                    height={300}
                                    className="w-[300px]"
                                />
                            </div>
                        ) : (
                            <div className="w-[300px] h-[300px] flex items-center justify-center text-gray-400">
                                Failed to load QR code
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handleDownload}
                        disabled={!qrCode || isLoading}
                        className="w-full bg-theme-green hover:bg-theme-green/90"
                    >
                        <FaDownload className="h-4 w-4" />
                        <span>Download QR Code</span>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
