import { apiClient } from "@/lib/api-client";

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    role: "SUPER_ADMIN" | "ADMIN";
}

export const getCurrentAdmin = async (): Promise<AdminUser> => {
    const response = await apiClient.get<AdminUser>("/api/v1/admin/auth/me");
    return response.data;
};

export const logoutAdmin = async (): Promise<void> => {
    await apiClient.post("/api/v1/admin/auth/logout", {});
};

// Full-page navigation, not an XHR - must hit the backend directly (not the
// Next.js rewrite) so the OAuth redirect chain and cookies originate from it.
export const GOOGLE_LOGIN_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/admin/auth/google`;
