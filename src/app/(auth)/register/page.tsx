"use client";

import { authApi } from "@/lib/utils";
import { registerSchema, RegisterFormData } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    try {
      await authApi.register({
        name: data.name,
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      router.replace("/login");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setServerError(msg || "Registration failed. Please try again.");
    }
  };

  const inputClass =
    "w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-violet-600 transition-all";
  const inputStyle = (hasError: boolean) => ({
    background: "#1e1e1e",
    border: hasError ? "1px solid #D9206E" : "1px solid transparent",
  });

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden py-10">
      {/* Purple radial glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full"
        style={{
          height: "65%",
          background:
            "radial-gradient(ellipse 90% 80% at 50% 110%, rgba(109,40,217,0.9) 0%, rgba(76,29,149,0.55) 38%, transparent 68%)",
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full mx-5 max-w-sm rounded-2xl px-7 py-9"
        style={{ background: "#111111" }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="flex items-center justify-center gap-2.5 mb-5"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path
              d="M13 1L14.8 10.2L24 13L14.8 15.8L13 25L11.2 15.8L2 13L11.2 10.2Z"
              fill="white"
            />
          </svg>
          <span className="text-white text-[1.2rem] font-semibold tracking-tight">
            Sociality
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.38 }}
          className="text-white text-[1.45rem] font-bold text-center mb-7"
        >
          Register
        </motion.h1>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-white text-sm font-medium">Name</label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter your name"
              autoComplete="name"
              className={inputClass}
              style={inputStyle(!!errors.name)}
            />
            {errors.name && (
              <p className="text-xs" style={{ color: "#D9206E" }}>{errors.name.message}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-white text-sm font-medium">Username</label>
            <input
              {...register("username")}
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              className={inputClass}
              style={inputStyle(!!errors.username)}
            />
            {errors.username && (
              <p className="text-xs" style={{ color: "#D9206E" }}>{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-white text-sm font-medium">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              className={inputClass}
              style={inputStyle(!!errors.email)}
            />
            {errors.email && (
              <p className="text-xs" style={{ color: "#D9206E" }}>{errors.email.message}</p>
            )}
          </div>

          {/* Number Phone */}
          <div className="space-y-1.5">
            <label className="block text-white text-sm font-medium">Number Phone</label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="Enter your number phone"
              autoComplete="tel"
              className={inputClass}
              style={inputStyle(!!errors.phone)}
            />
            {errors.phone && (
              <p className="text-xs" style={{ color: "#D9206E" }}>{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-white text-sm font-medium">Password</label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="new-password"
                className={`${inputClass} pr-12`}
                style={inputStyle(!!errors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs" style={{ color: "#D9206E" }}>{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-white text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="Enter your confirm password"
                autoComplete="new-password"
                className={`${inputClass} pr-12`}
                style={inputStyle(!!errors.confirmPassword)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs" style={{ color: "#D9206E" }}>{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-center"
              style={{ color: "#D9206E" }}
            >
              {serverError}
            </motion.p>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ opacity: 0.92 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-full text-white text-sm font-bold tracking-wide mt-1 transition-opacity disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </motion.button>

          {/* Login link */}
          <p className="text-center text-sm text-zinc-500 pt-0.5">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold hover:opacity-80 transition-opacity"
              style={{ color: "#7C3AED" }}
            >
              Log in
            </Link>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}