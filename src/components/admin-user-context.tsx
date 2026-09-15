"use client"

import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentAdmin, logoutAdmin, type AdminUser } from "@/services/adminAuth.service";

interface AdminUserContextType {
    admin: AdminUser | null;
    isLoading: boolean;
    logout: () => void;
}

const AdminUserContext = createContext<AdminUserContextType | undefined>(undefined);

export function AdminUserProvider({ children }: { children: React.ReactNode }) {
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const adminData = await getCurrentAdmin();
                setAdmin(adminData);
            } catch {
                setAdmin(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdmin();
    }, []);

    const logout = async () => {
        await logoutAdmin();
        setAdmin(null);
        window.location.href = "/login";
    };

    return (
        <AdminUserContext.Provider value={{ admin, isLoading, logout }}>
            {children}
        </AdminUserContext.Provider>
    );
}

export function useAdminUser() {
    const context = useContext(AdminUserContext);
    if (context === undefined) {
        throw new Error("useAdminUser must be used within an AdminUserProvider");
    }
    return context;
}
