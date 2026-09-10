"use client";

import { useState } from "react";
import { toast } from "sonner";
import { toggleUserStatusAction } from "@/features/admin/actions/toggle-user-status";

export function ToggleUserStatusButton({
  userId,
  isActive,
  isSelf,
}: {
  userId: string;
  isActive: boolean;
  isSelf: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(isActive);

  async function handleToggle() {
    if (isSelf) {
      toast.error("You cannot deactivate your own account");
      return;
    }

    setLoading(true);
    const result = await toggleUserStatusAction(userId, currentStatus);
    setLoading(false);

    if (!result.success) {
      toast.error(result.error ?? "Something went wrong");
      return;
    }

    setCurrentStatus(result.isActive!);
    toast.success(
      result.isActive
        ? "User activated successfully"
        : "User deactivated successfully",
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading || isSelf}
      style={{
        fontSize: "12px",
        padding: "4px 10px",
        borderRadius: "6px",
        border: `1px solid ${currentStatus ? "#fecaca" : "#bbf7d0"}`,
        background: currentStatus ? "#fef2f2" : "#f0fdf4",
        color: currentStatus ? "#dc2626" : "#16a34a",
        cursor: loading || isSelf ? "not-allowed" : "pointer",
        fontWeight: 600,
        opacity: isSelf ? 0.4 : 1,
        whiteSpace: "nowrap",
      }}
    >
      {loading ? "..." : currentStatus ? "Deactivate" : "Activate"}
    </button>
  );
}
