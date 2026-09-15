"use client"

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({ value, className }: { value: string; className?: string }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error("Failed to copy");
        }
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("size-6", className)}
            onClick={handleCopy}
        >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </Button>
    );
}
