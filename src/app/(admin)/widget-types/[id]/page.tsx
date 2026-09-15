"use client"

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { listWidgetTypes } from "@/services/widgetType.service";
import { WidgetType } from "@/features/widgetTypes/types";
import { WidgetTypeEditor } from "@/features/widgetTypes/WidgetTypeEditor";
import { Button } from "@/components/ui/button";

export default function WidgetTypeEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const widgetTypeId = Number(id);

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

    const current = widgetTypes.find((wt) => wt.id === widgetTypeId);

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
            ) : !current ? (
                <div className="text-muted-foreground">Widget type not found</div>
            ) : (
                <WidgetTypeEditor mode="edit" widgetTypes={widgetTypes} initial={current} onDataRefresh={refresh} />
            )}
        </div>
    );
}
