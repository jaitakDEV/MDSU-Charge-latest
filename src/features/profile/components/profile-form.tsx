"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/validations/auth";
import { updateProfileAction } from "@/features/profile/actions/update-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

export function ProfileForm({ user }: Props) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name ?? "", image: user.image ?? "" },
  });

  async function onSubmit(data: UpdateProfileInput) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const res = await updateProfileAction(user.id, data);
    setLoading(false);
    if (!res.success) {
      setError(res.error);
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          type="text"
          style={{ marginTop: "6px" }}
          {...register("name")}
        />
        {errors.name && (
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-text-danger)",
              marginTop: "4px",
            }}
          >
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          value={user.email}
          disabled
          style={{ marginTop: "6px", opacity: 0.6 }}
        />
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-text-secondary)",
            marginTop: "4px",
          }}
        >
          Email cannot be changed.
        </p>
      </div>

      {success && (
        <p style={{ fontSize: "13px", color: "var(--color-text-success)" }}>
          Profile updated successfully.
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
        {loading ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
