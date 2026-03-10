"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { finishLoading, setCredentials } from "@/store/slices/authSlice";
import { hydrateSaves } from "@/store/slices/savesSlice";
import { hydrateLikes } from "@/store/slices/likesSlice";
import { meApi } from "@/lib/api/me";
import { savesApi } from "@/lib/api/saves";
import { likesApi } from "@/lib/api/likes";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import BottomMenu from "@/components/layout/BottomMenu";
import { motion, AnimatePresence } from "framer-motion";

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2600);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#0a0a0a]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(109,40,217,0.12) 0%, transparent 70%)" }}
      />
      <div className="relative flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center bg-violet-800/60"
        >
          <svg width="36" height="36" viewBox="0 0 26 26" fill="none">
            <path d="M13 1L14.8 10.2L24 13L14.8 15.8L13 25L11.2 15.8L2 13L11.2 10.2Z" fill="white" />
          </svg>
        </motion.div>
        <div className="flex flex-col items-center gap-2 overflow-hidden">
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="text-white font-bold tracking-tight leading-none text-[42px]"
          >
            Sociality
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.55 }}
            className="text-white/40 text-sm"
          >
            Elevating Your Social
          </motion.p>
        </div>
        <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-violet-800/60"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

async function fetchAllIds(
  fetcher: (page: number) => Promise<any>,
  getList: (inner: any) => any[]
): Promise<number[]> {
  const ids: number[] = [];
  let page = 1;

  while (true) {
    const res = await fetcher(page);
    const inner = res.data?.data;
    const list = getList(inner);
    ids.push(...list.map((p: any) => p.id));

    const pagination = inner?.pagination;
    if (!pagination || page >= pagination.totalPages) break;
    page++;
  }

  return ids;
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [ready, setReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const hydrateUserData = async () => {
    try {
      dispatch(hydrateSaves());
      dispatch(hydrateLikes());

      const [savedIds, likedIds] = await Promise.all([
        fetchAllIds(
          (page) => savesApi.getMySaved(page),
          (inner) => Array.isArray(inner?.posts) ? inner.posts : Array.isArray(inner?.items) ? inner.items : []
        ),
        fetchAllIds(
          (page) => likesApi.getMyLikes(page),
          (inner) => Array.isArray(inner?.posts) ? inner.posts : Array.isArray(inner?.items) ? inner.items : []
        ),
      ]);

      localStorage.setItem("savedPostIds", JSON.stringify(savedIds));
      localStorage.setItem("likedPostIds", JSON.stringify(likedIds));

      dispatch(hydrateSaves());
      dispatch(hydrateLikes());
    } catch {
      dispatch(hydrateSaves());
      dispatch(hydrateLikes());
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(finishLoading());
      setReady(true);
      hydrateUserData();
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(finishLoading());
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }

    meApi.getMe().then((res) => {
      const data = res.data?.data ?? res.data;
      const user = data?.profile ?? data;
      dispatch(setCredentials({ token, user }));
      setReady(true);
      hydrateUserData();
    }).catch(() => {
      localStorage.removeItem("token");
      dispatch(finishLoading());
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    });
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" onDone={() => setShowSplash(false)} />}
      </AnimatePresence>
      {ready && !showSplash && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <Navbar />
          <main className="pb-24">{children}</main>
          <BottomMenu />
        </motion.div>
      )}
    </div>
  );
}