"use client"

import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

export default function ExternalUrlInterceptor() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [pendingUrl, setPendingUrl] = useState<string>("")

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            const anchor = target.closest('a')
            
            if (anchor && anchor.href) {
                const url = new URL(anchor.href, window.location.href)
                const isExternal = url.hostname !== window.location.hostname
                const escapable = anchor.href.startsWith('mailto:') || anchor.href.startsWith('tel:') || anchor.href.endsWith('.imo.gov.ng')

                if (escapable) {
                    return
                }
                
                if (isExternal) {
                    event.preventDefault()
                    setPendingUrl(anchor.href)
                    setDialogOpen(true)
                }
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    const handleContinue = () => {
        if (pendingUrl) {
            window.open(pendingUrl, '_blank', 'noopener,noreferrer')
        }
        setDialogOpen(false)
        setTimeout(() => {
            setPendingUrl("");
        }, 100);
    }

    const handleCancel = () => {
        setDialogOpen(false)
        setTimeout(() => {
            setPendingUrl("");
        }, 100);
    }

    const isSecure = pendingUrl.startsWith('https://');

    return (
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>You&apos;re about to leave this site</AlertDialogTitle>
                    <AlertDialogDescription>
                        You&apos;re being redirected to an external website. We&apos;re not responsible for the content or privacy practices of external sites.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="my-4 space-y-3">
                    <div className={cn(
                        "rounded-lg border bg-muted p-3 text-center",
                        isSecure ? "border-gray-200" : "border-red-400"
                        )}
                    >
                        <p className="text-sm font-medium mb-1">Destination URL:</p>
                        <p className={cn(
                            "break-all text-2xl font-semibold",
                            isSecure ? "text-blue-500" : "text-red-600"
                        )}
                        >{pendingUrl}</p>
                    </div>
                    
                    {!isSecure && (
                        <div className={cn(
                            "rounded-lg border border-red-400 bg-red-50 p-3 flex items-start gap-2",
                            isSecure ? "border-gray-200" : "border-red-400"
                            )}
                        >
                            <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-red-900">Not Secure</p>
                                <p className="text-sm text-red-800">This site uses HTTP and may not be secure. Your information could be visible to others.</p>
                            </div>
                        </div>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer" onClick={handleCancel}>Stay here</AlertDialogCancel>
                    <AlertDialogAction className={cn("cursor-pointer", !isSecure && "bg-red-600")} onClick={handleContinue}>
                        {isSecure ? <> Continue</> : <><AlertCircle className="w-5 h-5 mt-0.5 shrink-0"/> Proceed anyway</>}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}