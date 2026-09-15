import type { Metadata } from "next";
import "./globals.css";

import { AdminUserProvider } from "@/components/admin-user-context";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "TRAILBLAZER Admin",
  description: "Admin panel for the TRAILBLAZER platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased min-h-screen">
        <AdminUserProvider>
          {children}
          <Toaster />
        </AdminUserProvider>
      </body>
    </html>
  );
}
