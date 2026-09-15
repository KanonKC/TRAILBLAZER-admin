"use client"

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { listWidgetTypes } from "@/services/widgetType.service";
import { WidgetType } from "@/features/widgetTypes/types";
import { WidgetTypeEditor } from "@/features/widgetTypes/WidgetTypeEditor";
import { Button } from "@/components/ui/button";

export default function NewWidgetTypePage() {
    const [widgetTypes, setWidgetTypes] = useState<WidgetType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const data = await listWidgetTypes();
            setWidgetTypes(data);
        } catch {
            toast.error("Failed to load widget types");
        }
    }, []);

    useEffect(() => {
        refresh().finally(() => setIsLoading(false));
    }, [refresh]);

    return (
        <div className="space-y-4">
            <Button asChild variant="ghost" size="sm" className="-ml-2">
                <Link href="/widget-types">
                    <ArrowLeft />
                    Back to widget types
                </Link>
            </Button>

            {isLoading ? (
                <div className="text-muted-foreground">Loading…</div>
            ) : (
                <WidgetTypeEditor mode="new" widgetTypes={widgetTypes} onDataRefresh={refresh} />
            )}
        </div>
    );
}
