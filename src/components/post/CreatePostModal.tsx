"use client";

import { useCreatePost } from "@/hooks/usePosts";
import { createPostSchema, CreatePostFormData } from "@/schemas/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Upload, ImageIcon, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ open, onClose }: Props) {
  const router = useRouter();
  const { mutate: createPost, isPending } = useCreatePost();
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
  });

  const handleFile = (file: File) => {
    setValue("image", file, { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  const handleClose = () => {
    reset();
    setPreview(null);
    onClose();
  };

  const onSubmit = (data: CreatePostFormData) => {
    createPost(
      { image: data.image, caption: data.caption },
      {
        onSuccess: () => {
          toast.success("Post shared!", {
            description: "Your post is now live.",
            position: "top-center",
          });
          reset();
          setPreview(null);
          onClose();
        },
        onError: () => {
          toast.error("Failed to share post", {
            description: "Please try again.",
            position: "top-center",
          });
        },
      }
    );
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#0a0a0a" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <button
          onClick={handleClose}
          className="flex items-center gap-2 text-white hover:opacity-70 transition-opacity"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white font-bold text-base absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          Add Post
        </h1>
        {/* Avatar placeholder */}
        <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden">
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-lg mx-auto px-4 py-6 space-y-6"
        >
          {/* Photo section */}
          <div>
            <label className="block text-white text-sm font-semibold mb-3">
              Photo
            </label>

            {!preview ? (
              /* Upload dropzone */
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className="cursor-pointer flex flex-col items-center justify-center gap-2 rounded-xl py-10 transition-colors"
                style={{
                  background: "#111111",
                  border: errors.image
                    ? "1.5px dashed #D9206E"
                    : isDragging
                    ? "1.5px dashed #7C3AED"
                    : "1.5px dashed rgba(255,255,255,0.15)",
                }}
              >
                <Upload size={28} className="text-zinc-500" />
                <p className="text-sm">
                  <span style={{ color: "#7C3AED" }} className="font-medium">
                    Click to upload
                  </span>
                  <span className="text-zinc-400"> or drag and drop</span>
                </p>
                <p className="text-xs text-zinc-600">PNG or JPG  (max. 5mb)</p>
              </div>
            ) : (
              /* Preview */
              <div className="rounded-xl overflow-hidden" style={{ background: "#111111" }}>
                <img
                  src={preview}
                  alt="preview"
                  className="w-full object-cover"
                  style={{ maxHeight: "320px" }}
                />
                <div className="flex items-center gap-3 p-3">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                    style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <Upload size={15} />
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setValue("image", undefined as any);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#D9206E",
                    }}
                  >
                    <Trash2 size={15} />
                    Delete Image
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onFileInput}
              className="hidden"
            />

            {errors.image && (
              <p className="text-xs mt-1.5" style={{ color: "#D9206E" }}>
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Caption section */}
          <div>
            <label className="block text-white text-sm font-semibold mb-3">
              Caption
            </label>
            <div className="relative">
              <textarea
                {...register("caption")}
                placeholder="Create your caption"
                rows={4}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none resize-none transition-all"
                style={{
                  background: "#111111",
                  border: errors.caption
                    ? "1px solid #D9206E"
                    : "1px solid transparent",
                }}
              />
            </div>
            {errors.caption && (
              <p className="text-xs mt-1.5" style={{ color: "#D9206E" }}>
                {errors.caption.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isPending}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-full text-white text-sm font-bold tracking-wide transition-opacity disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" }}
          >
            {isPending ? "Sharing..." : "Share"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}