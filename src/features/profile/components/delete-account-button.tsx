// "use client";

// import { useState } from "react";
// import { signOut } from "next-auth/react";
// import { deleteAccountAction } from "@/features/profile/actions/delete-account";
// import { Button } from "@/components/ui/button";
// import { ROUTES } from "@/config/app";

// export function DeleteAccountButton({ userId }: { userId: string }) {
//   const [confirm, setConfirm] = useState(false);
//   const [loading, setLoading] = useState(false);

//   async function handleDelete() {
//     setLoading(true);
//     const res = await deleteAccountAction(userId);
//     if (res.success) {
//       await signOut({ callbackUrl: ROUTES.login });
//     }
//     setLoading(false);
//   }

//   if (!confirm) {
//     return (
//       <button
//         onClick={() => setConfirm(true)}
//         style={{
//           fontSize: "13px",
//           color: "var(--color-text-danger)",
//           background: "none",
//           border: "0.5px solid var(--color-border-danger)",
//           borderRadius: "var(--border-radius-md)",
//           padding: "7px 14px",
//           cursor: "pointer",
//         }}
//       >
//         Delete my account
//       </button>
//     );
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//       <p
//         style={{
//           fontSize: "13px",
//           color: "var(--color-text-danger)",
//           fontWeight: 500,
//         }}
//       >
//         Are you sure? This cannot be undone.
//       </p>
//       <div style={{ display: "flex", gap: "8px" }}>
//         <button
//           onClick={handleDelete}
//           disabled={loading}
//           style={{
//             fontSize: "13px",
//             color: "var(--color-text-danger)",
//             background: "none",
//             border: "0.5px solid var(--color-border-danger)",
//             borderRadius: "var(--border-radius-md)",
//             padding: "7px 14px",
//             cursor: "pointer",
//           }}
//         >
//           {loading ? "Deleting…" : "Yes, delete my account"}
//         </button>
//         <button
//           onClick={() => setConfirm(false)}
//           style={{
//             fontSize: "13px",
//             color: "var(--color-text-secondary)",
//             background: "none",
//             border: "0.5px solid var(--color-border-secondary)",
//             borderRadius: "var(--border-radius-md)",
//             padding: "7px 14px",
//             cursor: "pointer",
//           }}
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAccountAction } from "@/features/profile/actions/delete-account";
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
import { ROUTES } from "@/config/app";

export function DeleteAccountButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await deleteAccountAction(userId);
      if (res.success) {
        await signOut({ callbackUrl: ROUTES.login });
      } else {
        toast.error(res.error ?? "Failed to delete account. Please try again.");
        setLoading(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={(next) => !loading && setOpen(next)}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Delete my account
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account and all associated data.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Yes, delete my account"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
