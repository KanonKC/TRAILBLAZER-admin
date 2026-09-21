export interface AdminUserRecord {
    id: string;
    twitch_id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    tier: number;
    tier_expire_at: string | null;
    max_storage_mb: number;
    extra_widget_quota: number;
    is_showcase: boolean;
    consent_accepted_at: string | null;
    consent_version: string | null;
    created_at: string;
    updated_at: string;
    widget_count: number;
}

export interface AdminWidgetType {
    id: number;
    slug: string;
    display_name: string;
}

export interface AdminWidgetRecord {
    id: string;
    twitch_id: string;
    enabled: boolean;
    overlay_key: string | null;
    owner_id: string;
    triggered_count: number;
    widget_type_slug: string | null;
    widget_type: AdminWidgetType | null;
    created_at: string;
    updated_at: string;
}

export interface EventSubSubscription {
    id: string;
    status: string;
    type: string;
    version: string;
    condition: Record<string, unknown>;
    created_at: string;
    transport: { method: string; callback?: string };
    cost: number;
}

export interface TwitchEventDefinition {
    type: string;
    route: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total?: number;
}

export interface ListResponse<T> {
    data: T[];
    pagination: Pagination;
}
