"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { changePasswordAction } from "@/features/profile/actions/change-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Input = z.infer<typeof schema>;

export function PasswordChangeForm({ userId }: { userId: string }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Input>({ resolver: zodResolver(schema) });

  async function onSubmit(data: Input) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const res = await changePasswordAction(
      userId,
      data.currentPassword,
      data.newPassword,
    );
    setLoading(false);
    if (!res.success) {
      setError(res.error);
      return;
    }
    setSuccess(true);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div>
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          type="password"
          style={{ marginTop: "6px" }}
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-text-danger)",
              marginTop: "4px",
            }}
          >
            {errors.currentPassword.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          type="password"
          style={{ marginTop: "6px" }}
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-text-danger)",
              marginTop: "4px",
            }}
          >
            {errors.newPassword.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          type="password"
          style={{ marginTop: "6px" }}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-text-danger)",
              marginTop: "4px",
            }}
          >
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      {success && (
        <p style={{ fontSize: "13px", color: "var(--color-text-success)" }}>
          Password changed successfully.
        </p>
      )}
      {error && (
        <p style={{ fontSize: "13px", color: "var(--color-text-danger)" }}>
          {error}
        </p>
      )}
      <Button
        type="submit"
        disabled={loading}
        style={{ alignSelf: "flex-start" }}
      >
        {loading ? "Saving…" : "Change password"}
      </Button>
    </form>
  );
}
