"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAdminUser } from "@/components/admin-user-context";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { admin, isLoading } = useAdminUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !admin) {
            router.replace("/login");
        }
    }, [admin, isLoading, router]);

    if (isLoading || !admin) {
        return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
    }

    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="h-4" />
                    </header>
                    <div className="flex-1 p-6">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
