"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { AdminUserRow } from "@/lib/admin-users";

type AdminUsersPanelProps = {
  users: AdminUserRow[];
  currentUserId: string;
};

export function AdminUsersPanel({
  users,
  currentUserId,
}: AdminUsersPanelProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(q) ||
        user.fullName.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q),
    );
  }, [users, query]);

  async function setRole(id: string, role: "ADMIN" | "CUSTOMER") {
    const label = role === "ADMIN" ? "promote to admin" : "demote to customer";
    if (!window.confirm(`Really ${label}?`)) return;
    setPendingId(id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Role update failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Role update failed");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-[11px] tracking-[0.14em] text-[#6f675c] uppercase">
        Search users
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, email, or role…"
          className="min-h-11 border border-[#ddd4c5] bg-transparent px-3 text-sm tracking-normal text-[#1c1917] normal-case outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5]"
        />
      </label>

      {error ? <p className="text-sm text-red-800">{error}</p> : null}

      <p className="text-xs text-[#8a8278]">
        {filtered.length} of {users.length} users
      </p>

      {filtered.length === 0 ? (
        <p className="border-t border-[#ddd4c5]/80 pt-4 text-sm text-[#5c564e]">
          No users match this search.
        </p>
      ) : (
        <ul className="divide-y divide-[#ddd4c5]/80 border-t border-[#ddd4c5]/80">
          {filtered.map((user) => {
            const isSelf = user.id === currentUserId;
            const busy = pendingId === user.id;
            return (
              <li
                key={user.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#1c1917]">
                    {user.fullName}
                    {isSelf ? (
                      <span className="ml-2 text-xs font-normal tracking-[0.12em] text-[#8a8278] uppercase">
                        You
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-[#5c564e]">
                    {user.email}
                  </p>
                  <p className="mt-1 text-[11px] tracking-[0.12em] text-[#8a8278] uppercase">
                    {user.role} · joined {user.createdAt} · {user.orderCount}{" "}
                    order{user.orderCount === 1 ? "" : "s"} ·{" "}
                    {user.orderTotalLabel}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/dashboard/users/${user.id}`}
                    className="inline-flex min-h-11 items-center text-xs tracking-[0.12em] text-[#5c564e] uppercase transition hover:text-[#1c1917]"
                  >
                    Orders
                  </Link>
                  {user.role === "CUSTOMER" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void setRole(user.id, "ADMIN")}
                      className="inline-flex min-h-11 items-center border border-[#1c1917] px-3 text-xs tracking-[0.12em] text-[#1c1917] uppercase disabled:opacity-50"
                    >
                      Make admin
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busy || isSelf}
                      onClick={() => void setRole(user.id, "CUSTOMER")}
                      className="inline-flex min-h-11 items-center text-xs tracking-[0.12em] text-red-900 uppercase disabled:opacity-40"
                      title={
                        isSelf
                          ? "You cannot demote yourself"
                          : "Demote to customer"
                      }
                    >
                      Demote
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
