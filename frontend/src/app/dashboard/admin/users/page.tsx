"use client";

import { AdminPanel } from "@/components/dashboard/admin";
import { UsersTab } from "@/components/dashboard/admin/components/UsersTab";

export default function AdminUsersPage() {
  return (
    <AdminPanel>
      {(ctx) => (
        <UsersTab
          users={ctx.users}
          loading={ctx.usersLoading}
          onRoleChange={ctx.onRoleChange}
          onDelete={ctx.onDeleteUser}
          roleFilter={ctx.roleFilter}
          setRoleFilter={ctx.setRoleFilter}
          userSearch={ctx.userSearch}
          setUserSearch={ctx.setUserSearch}
        />
      )}
    </AdminPanel>
  );
}
