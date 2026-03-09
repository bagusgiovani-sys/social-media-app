"use client";

import { authApi } from "@/lib/api/auth";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/authSlice";
import { loginSchema, LoginFormData } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/feed";
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    try {
      const res = await authApi.login(data);
      const { token, user } = res.data.data;
      dispatch(setCredentials({ token, user }));
      router.replace(returnTo);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setServerError(msg || "Invalid email or password");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden">
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full"
        style={{
          height: "65%",
          background:
            "radial-gradient(ellipse 90% 80% at 50% 110%, rgba(109,40,217,0.9) 0%, rgba(76,29,149,0.55) 38%, transparent 68%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full mx-5 max-w-sm rounded-2xl px-7 py-9"
        style={{ background: "#111111" }}
      >
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

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.38 }}
          className="text-white text-[1.45rem] font-bold text-center mb-8"
        >
          Welcome Back!
        </motion.h1>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-1.5">
            <label className="block text-white text-sm font-medium">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-violet-600 transition-all"
              style={{
                background: "#1e1e1e",
                border: errors.email
                  ? "1px solid #D9206E"
                  : "1px solid transparent",
              }}
            />
            {errors.email && (
              <p className="text-xs" style={{ color: "#D9206E" }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-white text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-violet-600 transition-all"
                style={{
                  background: "#1e1e1e",
                  border: errors.password
                    ? "1px solid #D9206E"
                    : "1px solid transparent",
                }}
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
              <p className="text-xs" style={{ color: "#D9206E" }}>
                {errors.password.message}
              </p>
            )}
          </div>

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
            {isSubmitting ? "Logging in..." : "Login"}
          </motion.button>

          <p className="text-center text-sm text-zinc-500 pt-0.5">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold hover:opacity-80 transition-opacity"
              style={{ color: "#7C3AED" }}
            >
              Register
            </Link>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}
