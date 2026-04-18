"use client";

import { useTransition } from "react";

export default function LogoutButton({ onLogout }) {
  const [isPending, startTransition] = useTransition();

  async function handleLogout() {
    startTransition(async () => {
      await onLogout?.();
    });
  }

  return (
    <button className="ghost-button" type="button" onClick={handleLogout} disabled={isPending}>
      {isPending ? "Logging out..." : "Log Out"}
    </button>
  );
}
