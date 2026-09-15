"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { listUsers } from "@/services/adminUser.service";
import { AdminUserRecord } from "@/features/adminUsers/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/copy-button";
import { formatDate } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PAGE_SIZE = 20;
const TIER_OPTIONS = [0, 1, 2, 3];
const ALL_TIERS = "all";
const SHOWCASE_OPTIONS = [
    { value: "all", label: "All showcase" },
    { value: "true", label: "Showcase" },
    { value: "false", label: "Not showcase" },
];
const ALL_SHOWCASE = "all";

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUserRecord[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [tierFilter, setTierFilter] = useState(ALL_TIERS);
    const [showcaseFilter, setShowcaseFilter] = useState(ALL_SHOWCASE);
    const debouncedSearch = useDebouncedValue(search, 300);
    const tier = tierFilter === ALL_TIERS ? undefined : Number(tierFilter);
    const isShowcase = showcaseFilter === ALL_SHOWCASE ? undefined : showcaseFilter === "true";

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, tierFilter, showcaseFilter]);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        listUsers(page, PAGE_SIZE, debouncedSearch, tier, isShowcase)
            .then((res) => {
                if (cancelled) return;
                setUsers(res.data);
                setTotal(res.pagination.total ?? 0);
            })
            .catch(() => {
                if (!cancelled) toast.error("Failed to load users");
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [page, debouncedSearch, tier, isShowcase]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Users</h1>
                <span className="text-sm text-muted-foreground">{total} total</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by username, display name, or ID…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="Tier" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL_TIERS}>All tiers</SelectItem>
                        {TIER_OPTIONS.map((t) => (
                            <SelectItem key={t} value={String(t)}>
                                Tier {t}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={showcaseFilter} onValueChange={setShowcaseFilter}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Showcase" />
                    </SelectTrigger>
                    <SelectContent>
                        {SHOWCASE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>User ID</TableHead>
                            <TableHead>Twitch ID</TableHead>
                            <TableHead>Tier</TableHead>
                            <TableHead>Showcase</TableHead>
                            <TableHead>Widgets</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                    Loading…
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="cursor-pointer">
                                    <TableCell>
                                        <Link href={`/users/${user.id}`} className="flex items-center gap-2 hover:underline">
                                            {user.avatar_url && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={user.avatar_url} alt="" className="size-6 rounded-full" />
                                            )}
                                            <span>{user.display_name}</span>
                                            <span className="text-muted-foreground text-sm">@{user.username}</span>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <span className="font-mono truncate max-w-[8rem]">{user.id}</span>
                                            <CopyButton value={user.id} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <span className="font-mono">{user.twitch_id}</span>
                                            <CopyButton value={user.twitch_id} />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.tier > 0 ? "default" : "secondary"}>Tier {user.tier}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.is_showcase ? "default" : "secondary"}>
                                            {user.is_showcase ? "Showcase" : "No"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{user.widget_count}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatDate(user.created_at)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                </span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    Next
                </Button>
            </div>
        </div>
    );
}
