"use client";

import { authApi } from "@/lib/api/auth";
import { registerSchema, RegisterFormData } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    try {
      await authApi.register({ name: data.name, username: data.username, email: data.email, phone: data.phone, password: data.password });
      router.replace("/login");
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const inputBase = "w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-violet-600 transition-all bg-[#1e1e1e]";
  const inputCls = (hasError: boolean) => `${inputBase} ${hasError ? "border border-[#D9206E]" : "border border-transparent"}`;

  return (
    <AuthCard title="Register">
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <label className="block text-white text-sm font-medium">Name</label>
          <input {...register("name")} type="text" placeholder="Enter your name" autoComplete="name" className={inputCls(!!errors.name)} />
          {errors.name && <p className="text-xs text-[#D9206E]">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-white text-sm font-medium">Username</label>
          <input {...register("username")} type="text" placeholder="Enter your username" autoComplete="username" className={inputCls(!!errors.username)} />
          {errors.username && <p className="text-xs text-[#D9206E]">{errors.username.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-white text-sm font-medium">Email</label>
          <input {...register("email")} type="email" placeholder="Enter your email" autoComplete="email" className={inputCls(!!errors.email)} />
          {errors.email && <p className="text-xs text-[#D9206E]">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-white text-sm font-medium">Phone Number</label>
          <input {...register("phone")} type="tel" placeholder="Enter your phone number" autoComplete="tel" className={inputCls(!!errors.phone)} />
          {errors.phone && <p className="text-xs text-[#D9206E]">{errors.phone.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-white text-sm font-medium">Password</label>
          <div className="relative">
            <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="new-password" className={`${inputCls(!!errors.password)} pr-12`} />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-[#D9206E]">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-white text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <input {...register("confirmPassword")} type={showConfirm ? "text" : "password"} placeholder="Confirm your password" autoComplete="new-password" className={`${inputCls(!!errors.confirmPassword)} pr-12`} />
            <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-[#D9206E]">{errors.confirmPassword.message}</p>}
        </div>

        {serverError && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-center text-[#D9206E]">
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
          {isSubmitting ? "Submitting..." : "Submit"}
        </motion.button>

        <p className="text-center text-sm text-zinc-500 pt-0.5">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary-300 hover:opacity-50 transition-opacity">Log in</Link>
        </p>
      </motion.form>
    </AuthCard>
  );
}