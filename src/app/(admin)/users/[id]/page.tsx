"use client"

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { getUser, getUserWidgets, getUserEventSubs, updateUserShowcase } from "@/services/adminUser.service";
import { AdminUserRecord, AdminWidgetRecord, EventSubSubscription } from "@/features/adminUsers/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "@/components/copy-button";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between py-2 border-b last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [user, setUser] = useState<AdminUserRecord | null>(null);
    const [widgets, setWidgets] = useState<AdminWidgetRecord[]>([]);
    const [eventSubs, setEventSubs] = useState<EventSubSubscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [eventSubsError, setEventSubsError] = useState<string | null>(null);
    const [isSavingShowcase, setIsSavingShowcase] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setIsLoading(true);
            try {
                const [userRes, widgetsRes] = await Promise.all([getUser(id), getUserWidgets(id)]);
                if (cancelled) return;
                setUser(userRes);
                setWidgets(widgetsRes.data);
            } catch {
                if (!cancelled) toast.error("Failed to load user");
            } finally {
                if (!cancelled) setIsLoading(false);
            }

            try {
                const eventSubsRes = await getUserEventSubs(id);
                if (!cancelled) setEventSubs(eventSubsRes.data);
            } catch {
                if (!cancelled) setEventSubsError("Failed to load Twitch event subscriptions");
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    if (isLoading) {
        return <div className="text-muted-foreground">Loading…</div>;
    }

    if (!user) {
        return <div className="text-muted-foreground">User not found</div>;
    }

    async function handleShowcaseChange(checked: boolean) {
        if (!user) return;
        setIsSavingShowcase(true);
        const previous = user.is_showcase;
        setUser({ ...user, is_showcase: checked });
        try {
            await updateUserShowcase(user.id, checked);
            toast.success(checked ? "Added to showcase" : "Removed from showcase");
        } catch {
            setUser((prev) => (prev ? { ...prev, is_showcase: previous } : prev));
            toast.error("Failed to update showcase");
        } finally {
            setIsSavingShowcase(false);
        }
    }

    return (
        <div className="space-y-4">
            <Button asChild variant="ghost" size="sm" className="-ml-2">
                <Link href="/users">
                    <ArrowLeft />
                    Back to users
                </Link>
            </Button>

            <div className="flex items-center gap-3">
                {user.avatar_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar_url} alt="" className="size-12 rounded-full" />
                )}
                <div>
                    <h1 className="text-2xl font-semibold">{user.display_name}</h1>
                    <p className="text-muted-foreground text-sm">@{user.username}</p>
                </div>
            </div>

            <Tabs defaultValue="general">
                <TabsList>
                    <TabsTrigger value="general">General Info</TabsTrigger>
                    <TabsTrigger value="widgets">Widgets ({widgets.length})</TabsTrigger>
                    <TabsTrigger value="events">Twitch Events ({eventSubs.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardContent className="pt-6">
                            <InfoRow
                                label="User ID"
                                value={
                                    <span className="flex items-center gap-1 font-mono">
                                        {user.id}
                                        <CopyButton value={user.id} />
                                    </span>
                                }
                            />
                            <InfoRow
                                label="Twitch ID"
                                value={
                                    <span className="flex items-center gap-1 font-mono">
                                        {user.twitch_id}
                                        <CopyButton value={user.twitch_id} />
                                    </span>
                                }
                            />
                            <InfoRow label="Username" value={user.username} />
                            <InfoRow label="Display Name" value={user.display_name} />
                            <InfoRow label="Tier" value={<Badge>{user.tier}</Badge>} />
                            <InfoRow
                                label="Tier Expires"
                                value={user.tier_expire_at ? new Date(user.tier_expire_at).toLocaleString() : "—"}
                            />
                            <InfoRow label="Max Storage (MB)" value={user.max_storage_mb} />
                            <InfoRow label="Extra Widget Quota" value={user.extra_widget_quota} />
                            <InfoRow
                                label="Showcase"
                                value={
                                    <Switch
                                        checked={user.is_showcase}
                                        disabled={isSavingShowcase}
                                        onCheckedChange={handleShowcaseChange}
                                    />
                                }
                            />
                            <InfoRow
                                label="Consent Accepted"
                                value={user.consent_accepted_at ? new Date(user.consent_accepted_at).toLocaleString() : "—"}
                            />
                            <InfoRow label="Joined" value={new Date(user.created_at).toLocaleString()} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="widgets">
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Enabled</TableHead>
                                    <TableHead>Triggered Count</TableHead>
                                    <TableHead>Overlay Key</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {widgets.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                            No widgets
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    widgets.map((widget) => (
                                        <TableRow key={widget.id}>
                                            <TableCell>{widget.widget_type?.display_name ?? widget.widget_type_slug ?? "—"}</TableCell>
                                            <TableCell>
                                                <Badge variant={widget.enabled ? "success" : "destructive"}>
                                                    {widget.enabled ? "Enabled" : "Disabled"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{widget.triggered_count}</TableCell>
                                            <TableCell className="text-muted-foreground text-xs">{widget.overlay_key ?? "—"}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="events">
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Version</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {eventSubsError ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                            {eventSubsError}
                                        </TableCell>
                                    </TableRow>
                                ) : eventSubs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                            No active Twitch event subscriptions
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    eventSubs.map((sub) => (
                                        <TableRow key={sub.id}>
                                            <TableCell className="font-mono">{sub.type}</TableCell>
                                            <TableCell>
                                                <Badge variant={sub.status === "enabled" ? "success" : "destructive"}>
                                                    {sub.status.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase())}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{sub.version}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(sub.created_at).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
