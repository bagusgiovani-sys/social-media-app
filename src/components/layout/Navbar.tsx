"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, LogOut, User } from "lucide-react";
import Link from "next/link";
import SearchModal from "@/components/modals/SearchModal";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileDropdownOpen(false);
    dispatch(logout());
    router.replace("/login");
  };

  const handleDesktopSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) setSearchModalOpen(true);
  };

  useEffect(() => {
    if (mobileSearchOpen) setTimeout(() => mobileInputRef.current?.focus(), 150);
  }, [mobileSearchOpen]);

  const handleMobileSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && mobileQuery.trim()) {
      setSearchQuery(mobileQuery);
      setSearchModalOpen(true);
      setMobileSearchOpen(false);
      setMobileQuery("");
    }
  };

  const handleClose = () => {
    setSearchModalOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(e.target as Node)) setMobileDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const Avatar = ({ size = 8 }: { size?: number }) => (
    <div className={`rounded-full overflow-hidden bg-zinc-800 shrink-0 cursor-pointer w-${size} h-${size}`}>
      {user?.avatarUrl ? (
        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white text-xs font-semibold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );

  const DropdownMenu = () => (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-12 w-44 rounded-2xl overflow-hidden shadow-xl border border-white/8 bg-[#111111] z-50"
    >
      <button
        onClick={() => { setDropdownOpen(false); setMobileDropdownOpen(false); router.push("/me"); }}
        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white hover:bg-zinc-800 transition-colors"
      >
        <User size={15} className="text-zinc-400" /> My Profile
      </button>
      <div className="border-t border-white/8" />
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-accent-red hover:bg-zinc-800 transition-colors"
      >
        <LogOut size={15} /> Logout
      </button>
    </motion.div>
  );

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`sticky top-0 z-50 w-full border-b border-white/8 transition-all duration-300 ${
          scrolled ? "bg-zinc-600/10 backdrop-blur-xl" : "bg-zinc-800/50"
        }`}
      >
        <div className="mx-auto grid grid-cols-[auto_1fr_auto] h-14 max-w-7xl items-center gap-4 px-4 md:px-6">

          {/* Logo — shrinks to icon-only when mobile search is open */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <Link href="/feed" className="flex items-center gap-2 shrink-0">
              <svg width="22" height="22" viewBox="0 0 26 26" fill="none" className="shrink-0">
                <path d="M13 1L14.8 10.2L24 13L14.8 15.8L13 25L11.2 15.8L2 13L11.2 10.2Z" fill="white" />
              </svg>
              <motion.span
                animate={{ width: mobileSearchOpen ? 0 : "auto", opacity: mobileSearchOpen ? 0 : 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-white text-lg font-semibold tracking-tight overflow-hidden whitespace-nowrap md:block"
              >
                Sociality
              </motion.span>
            </Link>
          </motion.div>

          {/* PC: Search bar */}
          <motion.div
            className="hidden md:flex items-center gap-2 rounded-full px-4 py-2 bg-[#1a1a1a] border border-zinc-500/10 overflow-hidden justify-self-center"
            animate={{ width: desktopSearchOpen ? "320px" : "140px" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            whileHover={{ boxShadow: "0 0 0 1.5px #7C3AED, 0 0 12px #7C3AED40" }}
          >
            <Search size={15} className="text-zinc-400 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleDesktopSearch}
              onFocus={() => setDesktopSearchOpen(true)}
              onBlur={() => { if (!searchQuery) setDesktopSearchOpen(false); }}
              className="w-full bg-transparent text-sm text-white placeholder:text-zinc-400 outline-none"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setDesktopSearchOpen(false); }} className="text-zinc-500 hover:text-white transition-colors shrink-0">
                <X size={14} />
              </button>
            )}
          </motion.div>

          {/* PC: Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen((v) => !v)} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer">
                  <Avatar />
                  <span className="text-white text-sm font-medium">{user.name}</span>
                </button>
                <AnimatePresence>
                  {dropdownOpen && <DropdownMenu />}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-5 py-1.5 rounded-full text-sm font-medium text-white border border-zinc-700 hover:border-zinc-500 transition-colors">Login</Link>
                <Link href="/register" className="px-5 py-1.5 rounded-full text-sm font-bold text-white hover:opacity-90 transition-opacity bg-[#7C3AED]">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile: Right side */}
          <div className="flex md:hidden items-center gap-3 col-span-2 justify-end">
            <div className="flex items-center justify-end">
              <AnimatePresence>
                {mobileSearchOpen && (
                  <motion.div
                    className="flex items-center gap-2 rounded-full px-4 py-2 mr-2 bg-[#1a1a1a] overflow-hidden"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "170px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <input
                      ref={mobileInputRef}
                      type="text"
                      placeholder="Search..."
                      value={mobileQuery}
                      onChange={(e) => setMobileQuery(e.target.value)}
                      onKeyDown={handleMobileSearch}
                      className="w-full bg-transparent text-white text-sm outline-none placeholder:text-zinc-600"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => {
                  if (mobileSearchOpen) { setMobileSearchOpen(false); setMobileQuery(""); }
                  else setMobileSearchOpen(true);
                }}
                className="text-white p-1"
              >
                <AnimatePresence mode="wait">
                  {mobileSearchOpen ? (
                    <motion.span key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="block">
                      <X size={20} />
                    </motion.span>
                  ) : (
                    <motion.span key="search" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="block">
                      <Search size={20} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {isAuthenticated && user ? (
              <div className="relative" ref={mobileDropdownRef}>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setMobileDropdownOpen((v) => !v)} className="cursor-pointer">
                  <Avatar />
                </motion.button>
                <AnimatePresence>
                  {mobileDropdownOpen && <DropdownMenu />}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="text-white text-sm font-medium">Login</Link>
            )}
          </div>
        </div>
      </motion.nav>

      <SearchModal open={searchModalOpen} onClose={handleClose} initialQuery={searchQuery} />
    </>
  );
}