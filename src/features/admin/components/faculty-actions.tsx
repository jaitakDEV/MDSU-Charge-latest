"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminToggleActiveAction } from "@/features/admin/actions/admin-user-actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function FacultyActions({
  facultyId,
  isActive,
}: {
  facultyId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const res = await adminToggleActiveAction(facultyId, !isActive);
    setLoading(false);

    if (res.success) {
      toast.success(isActive ? "Faculty deactivated" : "Faculty activated");
      router.refresh();
    } else {
      toast.error("Action failed", { description: res.error });
    }
  }

  if (isActive) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            disabled={loading}
            className="font-medium"
          >
            Deactivate
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate this faculty?</AlertDialogTitle>
            <AlertDialogDescription>
              They will immediately lose access to the faculty portal. You can
              reactivate them anytime from this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggle}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleToggle}
      disabled={loading}
      className="border-emerald-200 bg-emerald-50 font-medium text-emerald-700 hover:bg-emerald-100"
    >
      {loading ? "Activating…" : "Activate"}
    </Button>
  );
}
