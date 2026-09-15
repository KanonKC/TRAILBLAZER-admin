"use client"

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { useAdminUser } from "@/components/admin-user-context";
import { GOOGLE_LOGIN_URL } from "@/services/adminAuth.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function LoginContent() {
    const { admin, isLoading } = useAdminUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    useEffect(() => {
        if (!isLoading && admin) {
            router.replace("/users");
        }
    }, [admin, isLoading, router]);

    if (isLoading || admin) {
        return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-xl font-bold">TRAILBLAZER Admin</CardTitle>
                    <CardDescription>Sign in with an authorized Google account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <p className="text-sm text-destructive text-center">
                            {decodeURIComponent(error)}
                        </p>
                    )}
                    <Button asChild className="w-full">
                        <a href={GOOGLE_LOGIN_URL}>Login with Google</a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}>
            <LoginContent />
        </Suspense>
    );
}
