'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FaFileAlt, FaFilePdf, FaFileImage, FaEye, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';

interface RenewalDocumentUploadCardProps {
    title: string;
    currentExpiry: string;
    status: 'expiring_soon' | 'expired';
    onFileUpload: (file: File, validFrom: string, validTo: string) => void;
}

interface UploadedFile {
    file: File;
    url: string;
    name: string;
    size: string;
    type: string;
    uploadedDate: string;
}

export default function RenewalDocumentUploadCard({
    title,
    currentExpiry,
    status,
    onFileUpload,
}: RenewalDocumentUploadCardProps) {
    const [validFrom, setValidFrom] = useState('');
    const [validTo, setValidTo] = useState('');
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [zoom, setZoom] = useState(100);

    const statusConfig = {
        expiring_soon: {
            label: 'Expiring Soon',
            borderColor: 'border-orange-300',
            bgColor: 'bg-white',
        },
        expired: {
            label: 'Expired',
            borderColor: 'border-red-300',
            bgColor: 'bg-white',
        },
    };

    const config = statusConfig[status];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                toast.error('Invalid file type. Please upload a PDF, PNG, or JPEG file');
                return;
            }

            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.error('File size too large. Maximum size is 10MB');
                return;
            }

            const fileUrl = URL.createObjectURL(file);
            const uploadedFileData: UploadedFile = {
                file,
                url: fileUrl,
                name: file.name,
                size: `${(file.size / 1024).toFixed(2)} KB`,
                type: file.type,
                uploadedDate: new Date().toLocaleDateString(),
            };

            setUploadedFile(uploadedFileData);
            if (validFrom && validTo) {
                onFileUpload(file, validFrom, validTo);
            }
            toast.success('Document uploaded successfully');
        }
    };

    const handleRemoveFile = () => {
        if (uploadedFile) {
            URL.revokeObjectURL(uploadedFile.url);
        }
        setUploadedFile(null);
    };

    const handlePreview = () => {
        setPreviewOpen(true);
    };

    const closePreview = () => {
        setPreviewOpen(false);
        setZoom(100);
    };

    return (
        <div className={`${config.bgColor} border ${config.borderColor} rounded-xl p-5 space-y-4`}>
            {/* Document Header */}
            <div className="flex items-start gap-3">
                <FaFileAlt className="text-gray-600 text-lg mt-1" />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                        <span
                            className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${
                                status === 'expired'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-orange-100 text-orange-700'
                            }`}
                        >
                            {config.label}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">Current expiry: {currentExpiry}</p>
                </div>
            </div>

            {/* Validity Period */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor={`validFrom-${title}`} className="text-xs text-gray-700 mb-1.5 block">
                        Valid From
                    </Label>
                    <Input
                        id={`validFrom-${title}`}
                        type="date"
                        value={validFrom}
                        onChange={(e) => setValidFrom(e.target.value)}
                        className="bg-gray-50 border-gray-200"
                    />
                </div>
                <div>
                    <Label htmlFor={`validTo-${title}`} className="text-xs text-gray-700 mb-1.5 block">
                        Valid To
                    </Label>
                    <Input
                        id={`validTo-${title}`}
                        type="date"
                        value={validTo}
                        onChange={(e) => setValidTo(e.target.value)}
                        className="bg-gray-50 border-gray-200"
                    />
                </div>
            </div>

            {/* Upload Section */}
            <div>
                <Label className="text-xs text-gray-700 mb-1.5 block">Upload Document</Label>
                {!uploadedFile ? (
                    <div className="relative">
                        <input
                            type="file"
                            id={`file-${title}`}
                            accept="application/pdf, image/jpeg, image/jpg, image/png"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label
                            htmlFor={`file-${title}`}
                            className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-gray-50 transition-colors bg-gray-50"
                        >
                            <div className="text-center">
                                <div className="text-gray-400 mb-2">
                                    <svg
                                        className="mx-auto h-8 w-8"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    Accepted: PDF, JPG, PNG (Max 10MB)
                                </p>
                            </div>
                        </label>
                    </div>
                ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                                {uploadedFile.type.includes('pdf') ? (
                                    <FaFilePdf className="text-red-600 mt-1 text-lg" />
                                ) : uploadedFile.type.startsWith('image/') ? (
                                    <FaFileImage className="text-blue-600 mt-1 text-lg" />
                                ) : (
                                    <FaFileAlt className="text-green-600 mt-1" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {uploadedFile.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-xs text-gray-600">
                                            {uploadedFile.size} • Uploaded {uploadedFile.uploadedDate}
                                        </p>
                                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                            {uploadedFile.type.includes('pdf') ? 'PDF' : uploadedFile.type.includes('png') ? 'PNG' : 'JPEG'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handlePreview}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                    <FaEye className="mr-1" />
                                    Preview
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemoveFile}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <FaTrash />
                                </Button>
                            </div>
                        </div>

                        {/* Replace Document Option */}
                        <div className="mt-3 pt-3 border-t border-green-200">
                            <input
                                type="file"
                                id={`replace-${title}`}
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor={`replace-${title}`}
                                className="text-xs text-gray-600 hover:text-gray-900 cursor-pointer underline"
                            >
                                Replace document
                            </label>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            {previewOpen && uploadedFile && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closePreview}>
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{uploadedFile.name}</p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={closePreview}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ✕
                            </Button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {uploadedFile.type.startsWith('image/') ? (
                                    <div className="flex justify-center bg-gray-50 rounded-lg p-4">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={uploadedFile.url}
                                            alt={uploadedFile.name}
                                            className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                        />
                                    </div>
                                ) : uploadedFile.type.includes('pdf') ? (
                                    <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                                        {/* Zoom Controls */}
                                        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setZoom(Math.max(50, zoom - 25))}
                                                disabled={zoom <= 50}
                                                className="h-8 w-8 p-0"
                                            >
                                                −
                                            </Button>
                                            <span className="text-xs font-medium min-w-12 text-center">{zoom}%</span>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setZoom(Math.min(200, zoom + 25))}
                                                disabled={zoom >= 200}
                                                className="h-8 w-8 p-0"
                                            >
                                                +
                                            </Button>
                                        </div>
                                        
                                        <div className="overflow-auto h-[70vh]" style={{ zoom: `${zoom}%` }}>
                                            <iframe
                                                src={`${uploadedFile.url}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                                                className="w-full h-full border-0"
                                                title={uploadedFile.name}
                                                style={{ minHeight: '70vh' }}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                                
                                {validFrom && validTo && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-900">
                                            <span className="font-medium">Valid Period:</span> {validFrom} to {validTo}
                                        </p>
                                    </div>
                                )}
                                
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        className="flex-1 bg-teal-700 hover:bg-teal-800"
                                        onClick={() => window.open(uploadedFile.url, '_blank')}
                                    >
                                        Open in New Tab
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = uploadedFile.url;
                                            link.download = uploadedFile.name;
                                            link.click();
                                        }}
                                    >
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
