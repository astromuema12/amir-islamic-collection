import { getAdminDashboard } from "@/lib/actions/admin-actions";
import { AdminDashboardClient } from "./admin-dashboard";
import { AlertTriangle, ShieldAlert, ServerCrash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();

  if (!data || "error" in data) {
    const isAuthError = data && "error" in data && data.error === "auth";

    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
          {isAuthError ? (
            <ShieldAlert className="h-10 w-10 text-destructive" />
          ) : (
            <AlertTriangle className="h-10 w-10 text-destructive" />
          )}
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {isAuthError ? "Access Denied" : "Dashboard Error"}
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {isAuthError
            ? "You do not have permission to view this page. Please log in as an administrator."
            : "Failed to load the dashboard data. This may be a temporary server or database issue."}
        </p>
        {data && "message" in data && (
          <p className="text-xs text-muted-foreground mb-4 font-mono max-w-lg break-all">
            {data.message}
          </p>
        )}
        <div className="flex gap-3">
          {isAuthError ? (
            <Link href="/login">
              <Button>Log In</Button>
            </Link>
          ) : (
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          )}
          <Link href="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <AdminDashboardClient data={data} />;
}
