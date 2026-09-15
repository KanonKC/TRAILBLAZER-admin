"use client"

import { Users, LayoutGrid, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAdminUser } from "@/components/admin-user-context";

const NAV_ITEMS = [
    { title: "Users", href: "/users", icon: Users },
    { title: "Widget Types", href: "/widget-types", icon: LayoutGrid },
];

export function AppSidebar() {
    const pathname = usePathname();
    const { admin, logout } = useAdminUser();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="px-2 py-1.5 text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
                    TRAILBLAZER Admin
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Manage</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-sm group-data-[collapsible=icon]:hidden">
                            <div className="flex flex-col min-w-0">
                                <span className="truncate font-medium">{admin?.name}</span>
                                <span className="truncate text-xs text-muted-foreground">{admin?.email}</span>
                            </div>
                        </div>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={logout} tooltip="Log out">
                            <LogOut />
                            <span>Log out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
