import { Metadata } from "next";

export const defaultMetadata: Metadata = {
    title: 'Imo State Government Procurement Portal',
    description: 'Official procurement and tender management system for the Imo State Government',
    keywords: [
        'Imo State Government',
        'Imo State procurement',
        'government procurement',
        'public procurement',
        'e-procurement',
        'tenders',
        'government tenders',
        'bidding',
        'vendor registration',
        'contract awards',
        'procurement portal Nigeria',
        'public sector purchasing',
        'supply chain management',
        'procurement transparency',
        'Imo State MDAs'
    ],
    icons: {
        icon: '/favicon/favicon.ico',
        apple: '/favicon/apple-touch-icon.png',
    },
    manifest: '/favicon/site.webmanifest',
};

export function getPageMetadata(overrides: Partial<typeof defaultMetadata> = {}) {
    return {
        ...defaultMetadata,
        ...overrides,
    };
}