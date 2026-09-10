"use client";

import { useState } from "react";
import { toast } from "sonner";
import { toggleCollegeStatusAction } from "@/features/admin/actions/college-actions";

export function ToggleCollegeStatusButton({
  collegeId,
  isActive,
}: {
  collegeId: string;
  isActive: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(isActive);

  async function handleToggle() {
    setLoading(true);
    const result = await toggleCollegeStatusAction(collegeId, !currentStatus);
    setLoading(false);

    if (!result.success) {
      toast.error(result.error ?? "Something went wrong.");
      return;
    }

    setCurrentStatus(!currentStatus);
    toast.success(
      !currentStatus
        ? "College activated successfully."
        : "College deactivated successfully.",
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      style={{
        fontSize: "12px",
        padding: "4px 10px",
        borderRadius: "6px",
        border: `1px solid ${currentStatus ? "#fecaca" : "#bbf7d0"}`,
        background: currentStatus ? "#fef2f2" : "#f0fdf4",
        color: currentStatus ? "#dc2626" : "#16a34a",
        cursor: loading ? "not-allowed" : "pointer",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {loading ? "..." : currentStatus ? "Deactivate" : "Activate"}
    </button>
  );
}
