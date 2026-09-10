// "use client";

// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { registerSchema, type RegisterInput } from "@/validations/auth";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { ROUTES } from "@/config/app";

// type College = {
//   id: string;
//   name: string;
//   city: string | null;
//   state: string | null;
//   isOther: boolean;
// };

// export function RegisterForm() {
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [colleges, setColleges] = useState<College[]>([]);
//   const [loadingColleges, setLoadingColleges] = useState(true);

//   const {
//     register,
//     control,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<RegisterInput>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: { registrationType: "STUDENT" },
//   });

//   const registrationType = watch("registrationType");

//   useEffect(() => {
//     fetch("/api/colleges")
//       .then((r) => r.json())
//       .then((data) => {
//         if (data.success) setColleges(data.data);
//       })
//       .catch(console.error)
//       .finally(() => setLoadingColleges(false));
//   }, []);

//   async function onSubmit(data: RegisterInput) {
//     setLoading(true);
//     setError(null);

//     const res = await fetch("/api/auth/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     const json = await res.json();
//     setLoading(false);

//     if (!json.success) {
//       setError(json.error ?? "Something went wrong");
//       toast.error("Registration failed", { description: json.error });
//       return;
//     }

//     setSuccess(true);
//     toast.success("Account created!", {
//       description: "Check your email to verify your account.",
//     });
//   }

//   if (success) {
//     return (
//       <div
//         style={{
//           padding: "16px",
//           background: "#f0fdf4",
//           border: "1px solid #bbf7d0",
//           borderRadius: "10px",
//           fontSize: "14px",
//           color: "#15803d",
//         }}
//       >
//         <p style={{ fontWeight: 600, marginBottom: "4px" }}>Check your email</p>
//         <p>
//           We've sent a verification link. Click it to activate your account.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       noValidate
//       style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
//     >
//       <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
//         <Label
//           htmlFor="name"
//           style={{
//             fontSize: "11px",
//             fontWeight: 700,
//             color: "#0951a5 ",
//             textTransform: "uppercase",
//             letterSpacing: "0.06em",
//           }}
//         >
//           Full Name
//         </Label>
//         <Input
//           id="name"
//           type="text"
//           placeholder="Your full name"
//           autoComplete="name"
//           style={{
//             height: "44px",
//             borderRadius: "10px",
//             borderColor: errors.name ? "#ef4444" : "#e2e8f0",
//             fontSize: "14px",
//           }}
//           {...register("name")}
//         />
//         {errors.name && (
//           <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
//             {errors.name.message}
//           </p>
//         )}
//       </div>

//       <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
//         <Label
//           htmlFor="email"
//           style={{
//             fontSize: "11px",
//             fontWeight: 700,
//             color: "#0951a5 ",
//             textTransform: "uppercase",
//             letterSpacing: "0.06em",
//           }}
//         >
//           Email Address
//         </Label>
//         <Input
//           id="email"
//           type="email"
//           placeholder="you@example.com"
//           autoComplete="email"
//           style={{
//             height: "44px",
//             borderRadius: "10px",
//             borderColor: errors.email ? "#ef4444" : "#e2e8f0",
//             fontSize: "14px",
//           }}
//           {...register("email")}
//         />
//         {errors.email && (
//           <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
//             {errors.email.message}
//           </p>
//         )}
//       </div>

//       <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
//         <Label
//           htmlFor="phoneNumber"
//           style={{
//             fontSize: "11px",
//             fontWeight: 700,
//             color: "#0951a5 ",
//             textTransform: "uppercase",
//             letterSpacing: "0.06em",
//           }}
//         >
//           Mobile Number
//         </Label>
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <span
//             style={{
//               fontSize: "14px",
//               color: "#475569",
//               padding: "0 4px",
//               flexShrink: 0,
//             }}
//           >
//             +91
//           </span>
//           <Input
//             id="phoneNumber"
//             type="tel"
//             placeholder="9876543210"
//             autoComplete="tel"
//             maxLength={10}
//             style={{
//               height: "44px",
//               borderRadius: "10px",
//               borderColor: errors.phoneNumber ? "#ef4444" : "#e2e8f0",
//               fontSize: "14px",
//               flex: 1,
//             }}
//             {...register("phoneNumber")}
//           />
//         </div>
//         {errors.phoneNumber && (
//           <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
//             {errors.phoneNumber.message}
//           </p>
//         )}
//       </div>

//       <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
//         <Label
//           style={{
//             fontSize: "11px",
//             fontWeight: 700,
//             color: "#0951a5 ",
//             textTransform: "uppercase",
//             letterSpacing: "0.06em",
//           }}
//         >
//           I am registering as
//         </Label>
//         <Controller
//           name="registrationType"
//           control={control}
//           render={({ field }) => (
//             <div style={{ display: "flex", gap: "10px" }}>
//               {(["STUDENT", "FACULTY"] as const).map((type) => (
//                 <button
//                   key={type}
//                   type="button"
//                   onClick={() => field.onChange(type)}
//                   style={{
//                     flex: 1,
//                     height: "44px",
//                     borderRadius: "10px",
//                     fontSize: "14px",
//                     fontWeight: 500,
//                     border:
//                       field.value === type
//                         ? "2px solid #0951a5"
//                         : "1px solid #e2e8f0",
//                     background: field.value === type ? "#D6E8FA" : "white",
//                     color: field.value === type ? "#0951a5" : "#475569",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {type === "STUDENT" ? "Student" : "Faculty"}
//                 </button>
//               ))}
//             </div>
//           )}
//         />
//         {errors.registrationType && (
//           <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
//             {errors.registrationType.message}
//           </p>
//         )}
//       </div>

//       <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
//         <Label
//           htmlFor="collegeId"
//           style={{
//             fontSize: "11px",
//             fontWeight: 700,
//             color: "#0951a5 ",
//             textTransform: "uppercase",
//             letterSpacing: "0.06em",
//           }}
//         >
//           {registrationType === "FACULTY"
//             ? "College (where you teach)"
//             : "College / University"}
//         </Label>
//         <select
//           id="collegeId"
//           disabled={loadingColleges}
//           style={{
//             height: "44px",
//             borderRadius: "10px",
//             fontSize: "14px",
//             border: `1px solid ${errors.collegeId ? "#ef4444" : "#e2e8f0"}`,
//             padding: "0 12px",
//             color: "#1e293b",
//             background: "white",
//             width: "100%",
//           }}
//           {...register("collegeId")}
//         >
//           <option value="">
//             {loadingColleges ? "Loading colleges..." : "Select your college"}
//           </option>
//           {colleges
//             .filter((c) => !c.isOther)
//             .map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.name}
//                 {c.city ? ` — ${c.city}` : ""}
//               </option>
//             ))}

//           {colleges
//             .filter((c) => c.isOther)
//             .map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.name}
//               </option>
//             ))}
//         </select>
//         {errors.collegeId && (
//           <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
//             {errors.collegeId.message}
//           </p>
//         )}
//       </div>

//       <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
//         <Label
//           htmlFor="password"
//           style={{
//             fontSize: "11px",
//             fontWeight: 700,
//             color: "#0951a5 ",
//             textTransform: "uppercase",
//             letterSpacing: "0.06em",
//           }}
//         >
//           Password
//         </Label>
//         <Input
//           id="password"
//           type="password"
//           placeholder="Min 8 chars, 1 uppercase, 1 number"
//           autoComplete="new-password"
//           style={{
//             height: "44px",
//             borderRadius: "10px",
//             borderColor: errors.password ? "#ef4444" : "#e2e8f0",
//             fontSize: "14px",
//           }}
//           {...register("password")}
//         />
//         {errors.password && (
//           <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
//             {errors.password.message}
//           </p>
//         )}
//       </div>

//       {error && (
//         <div
//           style={{
//             padding: "10px 14px",
//             background: "#fef2f2",
//             border: "1px solid #fecaca",
//             borderRadius: "10px",
//             fontSize: "13px",
//             color: "#dc2626",
//           }}
//         >
//           {error}
//         </div>
//       )}

//       <Button
//         type="submit"
//         disabled={loading}
//         style={{
//           height: "44px",
//           width: "100%",
//           background: loading ? "#0951a5 " : "#0951a5 ",
//           color: "#fff",
//           fontWeight: 600,
//           fontSize: "14px",
//           borderRadius: "10px",
//           border: "none",
//           cursor: loading ? "not-allowed" : "pointer",
//           marginTop: "4px",
//         }}
//       >
//         {loading ? "Creating account…" : "Create account"}
//       </Button>
//     </form>
//   );
// }

"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/config/app";

type College = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  isOther: boolean;
};

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { registrationType: "STUDENT" },
  });

  const registrationType = watch("registrationType");

  useEffect(() => {
    fetch("/api/colleges")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setColleges(data.data);
      })
      .catch(console.error)
      .finally(() => setLoadingColleges(false));
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 500);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  async function onSubmit(data: RegisterInput) {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    setLoading(false);

    if (!json.success) {
      setError(json.error ?? "Something went wrong");
      toast.error("Registration failed", { description: json.error });
      return;
    }

    setSuccess(true);
    toast.success("Account created!", {
      description: "Check your email to verify your account.",
    });
  }

  if (success) {
    return (
      <div
        style={{
          padding: "16px",
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "10px",
          fontSize: "14px",
          color: "#15803d",
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: "4px" }}>Check your email</p>
        <p>
          We've sent a verification link. Click it to activate your account.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Label
          htmlFor="name"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#0951a5",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Your full name"
          autoComplete="name"
          style={{
            height: "40px",
            borderRadius: "10px",
            borderColor: errors.name ? "#ef4444" : "#e2e8f0",
            fontSize: "14px",
          }}
          {...register("name")}
        />
        {errors.name && (
          <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
            {errors.name.message}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Label
          htmlFor="email"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#0951a5",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          style={{
            height: "40px",
            borderRadius: "10px",
            borderColor: errors.email ? "#ef4444" : "#e2e8f0",
            fontSize: "14px",
          }}
          {...register("email")}
        />
        {errors.email && (
          <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
            {errors.email.message}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Label
          htmlFor="phoneNumber"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#0951a5",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Mobile Number
        </Label>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "14px",
              color: "#475569",
              padding: "0 4px",
              flexShrink: 0,
            }}
          >
            +91
          </span>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="9876543210"
            autoComplete="tel"
            maxLength={10}
            style={{
              height: "40px",
              borderRadius: "10px",
              borderColor: errors.phoneNumber ? "#ef4444" : "#e2e8f0",
              fontSize: "14px",
              flex: 1,
            }}
            {...register("phoneNumber")}
          />
        </div>
        {errors.phoneNumber && (
          <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Label
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#0951a5",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          I am registering as
        </Label>
        <Controller
          name="registrationType"
          control={control}
          render={({ field }) => (
            <div style={{ display: "flex", gap: "10px" }}>
              {(["STUDENT", "FACULTY"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => field.onChange(type)}
                  style={{
                    flex: 1,
                    height: "40px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 500,
                    border:
                      field.value === type
                        ? "2px solid #0951a5"
                        : "1px solid #e2e8f0",
                    background: field.value === type ? "#D6E8FA" : "white",
                    color: field.value === type ? "#0951a5" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  {type === "STUDENT" ? "Student" : "Faculty"}
                </button>
              ))}
            </div>
          )}
        />
        {errors.registrationType && (
          <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
            {errors.registrationType.message}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          gridColumn: isMobile ? "1" : "1 / -1",
        }}
      >
        <Label
          htmlFor="collegeId"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#0951a5",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {registrationType === "FACULTY"
            ? "College (where you teach)"
            : "College / University"}
        </Label>
        <select
          id="collegeId"
          disabled={loadingColleges}
          style={{
            height: "40px",
            borderRadius: "10px",
            fontSize: "14px",
            border: `1px solid ${errors.collegeId ? "#ef4444" : "#e2e8f0"}`,
            padding: "0 12px",
            color: "#1e293b",
            background: "white",
            width: "100%",
          }}
          {...register("collegeId")}
        >
          <option value="">
            {loadingColleges ? "Loading colleges..." : "Select your college"}
          </option>
          {colleges
            .filter((c) => !c.isOther)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.city ? ` — ${c.city}` : ""}
              </option>
            ))}
          {colleges
            .filter((c) => c.isOther)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
        {errors.collegeId && (
          <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
            {errors.collegeId.message}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          gridColumn: isMobile ? "1" : "1 / -1",
        }}
      >
        <Label
          htmlFor="password"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#0951a5",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          autoComplete="new-password"
          style={{
            height: "40px",
            borderRadius: "10px",
            borderColor: errors.password ? "#ef4444" : "#e2e8f0",
            fontSize: "14px",
          }}
          {...register("password")}
        />
        {errors.password && (
          <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
            {errors.password.message}
          </p>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: "10px 14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#dc2626",
            gridColumn: isMobile ? "1" : "1 / -1",
          }}
        >
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        style={{
          height: "44px",
          width: "100%",
          background: "#0951a5",
          color: "#fff",
          fontWeight: 600,
          fontSize: "14px",
          borderRadius: "10px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          gridColumn: isMobile ? "1" : "1 / -1",
          marginTop: "2px",
        }}
      >
        {loading ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
