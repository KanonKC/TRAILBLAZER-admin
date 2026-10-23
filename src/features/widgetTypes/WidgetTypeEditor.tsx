"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import { WidgetType, WidgetTypeFormValues, EMPTY_WIDGET_TYPE_FORM } from "./types";
import {
    WIDGET_ICONS_PREFIX,
    defaultHrefForSlug,
    defaultIconFilenameForSlug,
    extractIconFilename,
    buildIconUrl,
} from "./utils";
import { createWidgetType, updateWidgetType, uploadWidgetTypeIcon } from "@/services/widgetType.service";
import { WidgetTypeCombobox } from "./WidgetTypeCombobox";
import { WidgetIconPreview } from "./WidgetIconPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function toFormValues(widgetType: WidgetType): WidgetTypeFormValues {
    return {
        slug: widgetType.slug,
        display_name: widgetType.display_name,
        description: widgetType.description ?? "",
        cost: widgetType.cost,
        icon_url: widgetType.icon_url ?? "",
        theme_color: widgetType.theme_color ?? "",
        href: widgetType.href ?? "",
        availability: widgetType.availability,
    };
}

export function WidgetTypeEditor({
    mode,
    widgetTypes,
    initial,
    onDataRefresh,
}: {
    mode: "new" | "edit";
    widgetTypes: WidgetType[];
    initial?: WidgetType;
    onDataRefresh?: () => Promise<void>;
}) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [values, setValues] = useState<WidgetTypeFormValues>(
        initial ? toFormValues(initial) : EMPTY_WIDGET_TYPE_FORM
    );
    const [iconFilename, setIconFilename] = useState(initial?.icon_url ? extractIconFilename(initial.icon_url) : "");
    const [hrefTouched, setHrefTouched] = useState(mode === "edit");
    const [iconTouched, setIconTouched] = useState(mode === "edit");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFilePreviewUrl, setSelectedFilePreviewUrl] = useState<string | null>(null);

    // Selecting a file gets an instant local preview (object URL) before the
    // upload round-trip finishes; the URL is revoked whenever it's replaced.
    useEffect(() => {
        if (!selectedFile) return;
        const url = URL.createObjectURL(selectedFile);
        setSelectedFilePreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [selectedFile]);

    const set = <K extends keyof WidgetTypeFormValues>(key: K, value: WidgetTypeFormValues[K]) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    function handleSlugChange(slug: string) {
        set("slug", slug);
        if (!hrefTouched) {
            set("href", slug ? defaultHrefForSlug(slug) : "");
        }
        if (!iconTouched) {
            const filename = slug ? defaultIconFilenameForSlug(slug) : "";
            setIconFilename(filename);
            set("icon_url", buildIconUrl(filename));
        }
    }

    function handleIconFilenameChange(filename: string) {
        setIconTouched(true);
        setIconFilename(filename);
        set("icon_url", buildIconUrl(filename));
    }

    function handleUploadClick() {
        fileInputRef.current?.click();
    }

    async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        setSelectedFile(file);
        const filename = iconFilename || defaultIconFilenameForSlug(values.slug || "widget");
        setIsUploading(true);
        try {
            const result = await uploadWidgetTypeIcon(filename, file);
            setIconTouched(true);
            setIconFilename(filename);
            set("icon_url", result.url);
            toast.success(`Icon uploaded as ${filename}`);
            await onDataRefresh?.();
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to upload icon");
        } finally {
            setIsUploading(false);
            setSelectedFile(null);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (mode === "edit" && initial) {
                await updateWidgetType(initial.id, values);
                toast.success("Widget type updated");
            } else {
                const created = await createWidgetType(values);
                toast.success("Widget type created");
                router.push(`/widget-types/${created.id}`);
                return;
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to save widget type");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-4 max-w-2xl">
            <div className="space-y-2">
                <Label>Switch widget type</Label>
                <WidgetTypeCombobox
                    widgetTypes={widgetTypes}
                    value={initial?.id ?? null}
                    onSelect={(wt) => router.push(`/widget-types/${wt.id}`)}
                    placeholder={mode === "new" ? "Creating a new widget type…" : "Select a widget type…"}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{mode === "edit" ? `Edit "${initial?.display_name}"` : "New Widget Type"}</CardTitle>
                    <CardDescription>
                        How the icon currently in use will render on the Widget Gallery
                    </CardDescription>
                    <div className="pt-2">
                        <WidgetIconPreview src={values.icon_url || null} themeColor={values.theme_color} />
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={values.slug}
                                    onChange={(e) => handleSlugChange(e.target.value)}
                                    disabled={mode === "edit"}
                                    required
                                    className="font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="display_name">Display Name</Label>
                                <Input
                                    id="display_name"
                                    value={values.display_name}
                                    onChange={(e) => set("display_name", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={values.description}
                                onChange={(e) => set("description", e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cost">Cost</Label>
                                <Input
                                    id="cost"
                                    type="number"
                                    min={0}
                                    value={values.cost}
                                    onChange={(e) => set("cost", Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="theme_color">Theme Color</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={/^#[0-9a-fA-F]{6}$/.test(values.theme_color) ? values.theme_color : "#000000"}
                                        onChange={(e) => set("theme_color", e.target.value)}
                                        className="size-9 shrink-0 rounded-md border cursor-pointer bg-transparent p-1"
                                    />
                                    <Input
                                        id="theme_color"
                                        value={values.theme_color}
                                        onChange={(e) => set("theme_color", e.target.value)}
                                        placeholder="#3b82f6"
                                    />
                                    <div
                                        className="size-9 shrink-0 rounded-md border"
                                        style={{ backgroundColor: values.theme_color || "transparent" }}
                                        title="Example"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="href">Href</Label>
                            <Input
                                id="href"
                                value={values.href}
                                onChange={(e) => {
                                    setHrefTouched(true);
                                    set("href", e.target.value);
                                }}
                                placeholder={values.slug ? defaultHrefForSlug(values.slug) : "/dashboard/widgets/..."}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="availability">Availability</Label>
                            <Select value={values.availability} onValueChange={(value: WidgetTypeFormValues["availability"]) => set("availability", value)}>
                                <SelectTrigger id="availability"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hide">Hide</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="whitelist_only">Whitelist Only</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => router.push("/widget-types")}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? "Saving…" : "Save"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Icon</CardTitle>
                    <CardDescription>
                        Files are uploaded to {WIDGET_ICONS_PREFIX} — only the filename below is editable
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="icon_filename">Filename</Label>
                        <div className="flex items-center gap-1 rounded-md border pr-1 focus-within:ring-1 focus-within:ring-ring">
                            <span className="pl-3 py-2 text-sm text-muted-foreground whitespace-nowrap select-none">
                                {WIDGET_ICONS_PREFIX}
                            </span>
                            <input
                                id="icon_filename"
                                value={iconFilename}
                                onChange={(e) => handleIconFilenameChange(e.target.value)}
                                placeholder={values.slug ? defaultIconFilenameForSlug(values.slug) : "icon-name.svg"}
                                className="flex-1 min-w-0 bg-transparent py-2 text-sm outline-none"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleUploadClick}
                                disabled={isUploading}
                            >
                                <Upload />
                                {isUploading ? "Uploading…" : "Upload"}
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelected}
                            />
                        </div>
                        {values.icon_url && (
                            <p className="text-xs text-muted-foreground break-all pt-1">{values.icon_url}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>{selectedFilePreviewUrl ? "Preview" : "Current"}</Label>
                        <WidgetIconPreview
                            src={selectedFilePreviewUrl ?? (values.icon_url || null)}
                            themeColor={values.theme_color}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
