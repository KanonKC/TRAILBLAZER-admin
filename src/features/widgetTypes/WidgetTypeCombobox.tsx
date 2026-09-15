"use client"

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { WidgetType } from "./types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function WidgetIconBadge({ widgetType }: { widgetType: WidgetType }) {
    return (
        <div
            className="flex size-6 shrink-0 items-center justify-center rounded-md border"
            style={{ backgroundColor: widgetType.theme_color ? `${widgetType.theme_color}22` : undefined }}
        >
            {widgetType.icon_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={widgetType.icon_url} alt="" className="size-4 object-contain" />
            ) : (
                <div
                    className="size-2.5 rounded-full border"
                    style={{ backgroundColor: widgetType.theme_color ?? undefined }}
                />
            )}
        </div>
    );
}

export function WidgetTypeCombobox({
    widgetTypes,
    value,
    onSelect,
    placeholder = "Select a widget type…",
}: {
    widgetTypes: WidgetType[];
    value: number | null;
    onSelect: (widgetType: WidgetType) => void;
    placeholder?: string;
}) {
    const [open, setOpen] = useState(false);
    const selected = widgetTypes.find((wt) => wt.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full max-w-sm justify-between font-normal"
                >
                    {selected ? (
                        <span className="flex items-center gap-2 truncate">
                            <WidgetIconBadge widgetType={selected} />
                            {selected.display_name}
                            <span className="text-muted-foreground">({selected.slug})</span>
                        </span>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Search widget types…" />
                    <CommandList>
                        <CommandEmpty>No widget type found.</CommandEmpty>
                        <CommandGroup>
                            {widgetTypes.map((wt) => (
                                <CommandItem
                                    key={wt.id}
                                    value={`${wt.display_name} ${wt.slug}`}
                                    onSelect={() => {
                                        onSelect(wt);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn("mr-1", wt.id === value ? "opacity-100" : "opacity-0")} />
                                    <WidgetIconBadge widgetType={wt} />
                                    <span>{wt.display_name}</span>
                                    <span className="text-muted-foreground">({wt.slug})</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
