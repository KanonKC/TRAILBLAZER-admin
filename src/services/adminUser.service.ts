import { apiClient } from "@/lib/api-client";
import {
    AdminUserRecord,
    AdminWidgetRecord,
    EventSubSubscription,
    ListResponse,
} from "@/features/adminUsers/types";

export const listUsers = async (
    page: number,
    limit: number,
    search?: string,
    tier?: number,
    isShowcase?: boolean
): Promise<ListResponse<AdminUserRecord>> => {
    const response = await apiClient.get<ListResponse<AdminUserRecord>>("/api/v1/admin/users", {
        params: { page, limit, search: search || undefined, tier: tier ?? undefined, is_showcase: isShowcase ?? undefined },
    });
    return response.data;
};

export const getUser = async (id: string): Promise<AdminUserRecord> => {
    const response = await apiClient.get<AdminUserRecord>(`/api/v1/admin/users/${id}`);
    return response.data;
};

export const updateUserShowcase = async (id: string, isShowcase: boolean): Promise<AdminUserRecord> => {
    const response = await apiClient.put<AdminUserRecord>(`/api/v1/admin/users/${id}`, { is_showcase: isShowcase });
    return response.data;
};

export const getUserWidgets = async (id: string): Promise<ListResponse<AdminWidgetRecord>> => {
    const response = await apiClient.get<ListResponse<AdminWidgetRecord>>(`/api/v1/admin/users/${id}/widgets`, {
        params: { page: 1, limit: 100 },
    });
    return response.data;
};

export const getUserEventSubs = async (id: string): Promise<{ data: EventSubSubscription[] }> => {
    const response = await apiClient.get<{ data: EventSubSubscription[] }>(`/api/v1/admin/users/${id}/event-subs`);
    return response.data;
};
