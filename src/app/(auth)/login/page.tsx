"use client";

import { authApi } from "@/lib/api/auth";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/authSlice";
import { loginSchema, LoginFormData } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";

function LoginContent() {
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
    <AuthCard title="Welcome Back!">
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="space-y-1.5">
          <label className="block text-white text-sm font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            className={`w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-violet-600 transition-all bg-[#1e1e1e] ${errors.email ? "border border-[#D9206E]" : "border border-transparent"}`}
          />
          {errors.email && <p className="text-xs text-[#D9206E]">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-white text-sm font-medium">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`w-full rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-violet-600 transition-all bg-[#1e1e1e] ${errors.password ? "border border-[#D9206E]" : "border border-transparent"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-accent-red">{errors.password.message}</p>}
        </div>

        {serverError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-center text-accent-red"
          >
            {serverError}
          </motion.p>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ opacity: 0.92 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3.5 rounded-full text-white text-sm font-bold tracking-wide mt-1 transition-opacity disabled:opacity-50 bg-primary-300"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </motion.button>

        <p className="text-center text-sm text-zinc-500 pt-0.5">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary-300 hover:opacity-50 transition-opacity">
            Register
          </Link>
        </p>
      </motion.form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}