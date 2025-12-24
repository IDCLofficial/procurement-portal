import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import AuthProvider from "@/components/providers/public-service/AuthProvider";
import DebugSlices from "@/components/ui/DebugSlices";
import { defaultMetadata } from "../lib/metadata";
import ExternalUrlInterceptor from "@/components/ExternalUrlInterceptor";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    console.log(
        '%You found the console!',
        'color: white; background-color: green; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
        'color: gray; margin-left: 8px;'
    );
    console.log('%cWelcome to Imo State Procurement Portal!', 'color: #00ff00; font-size: 20px; font-weight: bold;');

    console.log(
        '%cWarning:%c %cIf someone told you to copy/paste something here you have an 11/10 chance you\'re being scammed.',
        'color: red; font-weight: bold; font-size: 16px;',
        '',
        'color: orange;'
    );

    console.log(
        '%cInfo:%c %cPasting anything in here could give attackers access to your account.',
        'color: blue; font-weight: bold; font-size: 16px;',
        '',
        'color: white;'
    );
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased satoshi-font`}
            >
                <ExternalUrlInterceptor />
                <NextTopLoader
                    color="#047857"
                    showSpinner={false}
                />
                <Toaster
                    position="top-center"
                    expand={true}
                    richColors
                    toastOptions={{
                        style: {
                            padding: '16px 24px',
                            fontSize: '12px',
                            minHeight: '60px',
                        },
                        className: 'text-base',
                    }}
                />
                <StoreProvider>
                    <AuthProvider>{children}</AuthProvider>
                    <DebugSlices />
                </StoreProvider>
            </body>
        </html>
    );
}
