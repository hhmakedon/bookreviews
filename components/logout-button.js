"use client";

import { useState } from "react";

export default function LogoutButton({ onLogout }) {
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);

    try {
      await onLogout?.();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button className="ghost-button" type="button" onClick={handleLogout} disabled={isPending}>
      {isPending ? "Logging out..." : "Log Out"}
    </button>
  );
}
