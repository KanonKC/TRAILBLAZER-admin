"use client"

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

import { WidgetType } from "@/features/widgetTypes/types";
import { listWidgetTypes, deleteWidgetType } from "@/services/widgetType.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function WidgetTypesPage() {
    const router = useRouter();
    const [widgetTypes, setWidgetTypes] = useState<WidgetType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState<WidgetType | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const load = () => {
        setIsLoading(true);
        listWidgetTypes()
            .then(setWidgetTypes)
            .catch(() => toast.error("Failed to load widget types"))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return widgetTypes;
        return widgetTypes.filter(
            (wt) => wt.display_name.toLowerCase().includes(q) || wt.slug.toLowerCase().includes(q)
        );
    }, [widgetTypes, search]);

    async function confirmDelete() {
        if (!deleting) return;
        setIsDeleting(true);
        try {
            await deleteWidgetType(deleting.id);
            toast.success("Widget type deleted");
            setDeleting(null);
            load();
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to delete widget type");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Widget Types</h1>
                <Button asChild>
                    <Link href="/widget-types/new">
                        <Plus />
                        New Widget Type
                    </Link>
                </Button>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder="Search widget types…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                />
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-14" />
                            <TableHead>Display Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-24" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    Loading…
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    No widget types found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((wt) => (
                                <TableRow
                                    key={wt.id}
                                    className="cursor-pointer"
                                    onClick={() => router.push(`/widget-types/${wt.id}`)}
                                >
                                    <TableCell>
                                        <div
                                            className="flex size-9 items-center justify-center rounded-md border"
                                            style={{ backgroundColor: wt.theme_color ? `${wt.theme_color}22` : undefined }}
                                        >
                                            {wt.icon_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={wt.icon_url} alt="" className="size-6 object-contain" />
                                            ) : (
                                                <div
                                                    className="size-4 rounded-full border"
                                                    style={{ backgroundColor: wt.theme_color ?? undefined }}
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{wt.display_name}</TableCell>
                                    <TableCell className="text-muted-foreground font-mono">{wt.slug}</TableCell>
                                    <TableCell>{wt.cost}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Badge variant={wt.is_active ? "success" : "destructive"}>
                                                {wt.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                            {!wt.is_display && <Badge variant="outline">Hidden</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-1">
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={`/widget-types/${wt.id}`} onClick={(e) => e.stopPropagation()}>
                                                    <Pencil />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleting(wt);
                                                }}
                                            >
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete &quot;{deleting?.display_name}&quot;?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This cannot be undone. If any widgets still use this type, deletion will be blocked —
                            disable it instead.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
