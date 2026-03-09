"use client";

import { useUpdateMe, useMe } from "@/hooks/useMe";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormData } from "@/schemas/profile.schema";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ open, onClose }: Props) {
  const { data: meData } = useMe();
  const user = meData?.profile ?? meData;
  const { mutate: updateMe, isPending } = useUpdateMe();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user && open) {
      reset({
        name: user.name ?? "",
        username: user.username ?? "",
        phone: user.phone ?? "",
        bio: (user as any).bio ?? "",
      });
      setAvatarPreview(user.avatarUrl ?? null);
      setAvatarFile(null);
    }
  }, [user, open]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = (data: ProfileFormData) => {
    updateMe(
      { ...data, avatar: avatarFile ?? undefined },
      {
        onSuccess: () => {
          toast.success("Profile updated!", { position: "top-center" });
          onClose();
        },
        onError: () => {
          toast.error("Failed to update profile", { position: "top-center" });
        },
      }
    );
  };

  if (!open) return null;

  const inputClass = "w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-violet-600 transition-all";
  const inputStyle = (hasError: boolean) => ({
    background: "#111111",
    border: hasError ? "1px solid #D9206E" : "1px solid transparent",
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto" style={{ background: "#0a0a0a" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 h-14 border-b shrink-0"
        style={{ background: "#0a0a0a", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <button onClick={onClose} className="text-white hover:opacity-70 transition-opacity">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white font-bold text-base">Edit Profile</h1>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 max-w-lg mx-auto w-full px-4 py-6">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 mb-3">
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="px-5 py-1.5 rounded-full text-sm font-medium text-white border border-zinc-700 hover:border-zinc-500 transition-colors"
          >
            Change Photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-white text-sm font-medium">Name</label>
            <input {...register("name")} type="text" className={inputClass} style={inputStyle(!!errors.name)} />
            {errors.name && <p className="text-xs" style={{ color: "#D9206E" }}>{errors.name.message}</p>}
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-white text-sm font-medium">Username</label>
            <input {...register("username")} type="text" className={inputClass} style={inputStyle(!!errors.username)} />
            {errors.username && <p className="text-xs" style={{ color: "#D9206E" }}>{errors.username.message}</p>}
          </div>

          {/* Email — display only, not editable */}
          <div className="space-y-1.5">
            <label className="block text-white text-sm font-medium">Email</label>
            <input
              value={user?.email ?? ""}
              readOnly
              className={inputClass}
              style={{ background: "#111111", border: "1px solid transparent", opacity: 0.6, cursor: "not-allowed" }}
            />
          </div>

          {/* Number Phone */}
          <div className="space-y-1.5">
            <label className="block text-white text-sm font-medium">Number Phone</label>
            <input {...register("phone")} type="tel" className={inputClass} style={inputStyle(!!errors.phone)} />
            {errors.phone && <p className="text-xs" style={{ color: "#D9206E" }}>{errors.phone.message}</p>}
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="block text-white text-sm font-medium">Bio</label>
            <textarea
              {...register("bio")}
              rows={3}
              className={inputClass + " resize-none"}
              style={inputStyle(!!errors.bio)}
            />
            {errors.bio && <p className="text-xs" style={{ color: "#D9206E" }}>{errors.bio.message}</p>}
          </div>

          {/* Save */}
          <motion.button
            type="submit"
            disabled={isPending}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-full text-white text-sm font-bold tracking-wide mt-2 transition-opacity disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" }}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </form>
    </div>
  );
}