import { Suspense } from "react";
import { AdminUsersPanel } from "@/components/admin-users-panel";
import { requireAdminPage } from "@/lib/auth";
import { listAdminUsers } from "@/lib/admin-users";

async function UsersContent() {
  const admin = await requireAdminPage("/dashboard/users");
  const users = await listAdminUsers();
  return <AdminUsersPanel users={users} currentUserId={admin.id} />;
}

export default function DashboardUsersPage() {
  return (
    <main className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Users
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c564e] sm:text-base">
          Search accounts, promote admins, and open each user’s commandes
          (orders matched by email from checkout).
        </p>
      </header>
      <Suspense
        fallback={
          <div className="h-40 animate-pulse rounded-sm bg-[#ebe4d8]/70" />
        }
      >
        <UsersContent />
      </Suspense>
    </main>
  );
}
