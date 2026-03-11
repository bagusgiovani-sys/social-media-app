"use client";

import { motion } from "framer-motion";
import RisingDashes from "@/components/RisingDashes";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, children }: Props) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden">
      <RisingDashes />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[65%] bg-[radial-gradient(ellipse_90%_80%_at_50%_110%,rgba(109,40,217,0.9)_0%,rgba(76,29,149,0.55)_38%,transparent_68%)]" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full mx-5 max-w-sm rounded-2xl px-7 py-9 bg-zinc-900/60 backdrop-blur-xs"
      >
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="flex items-center justify-center gap-2.5 mb-5"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M13 1L14.8 10.2L24 13L14.8 15.8L13 25L11.2 15.8L2 13L11.2 10.2Z" fill="white" />
          </svg>
          <span className="text-white text-[1.2rem] font-semibold tracking-tight">Sociality</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.38 }}
          className="text-white text-[1.45rem] font-bold text-center mb-8"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}