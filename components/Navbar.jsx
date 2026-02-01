"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  Layers,
  Puzzle,
  Map,
  User,
  LogOut,
  Cloud,
  CloudOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/progress-context";
import { useState } from "react";

const NAV_ITEMS = [
  { path: "/", label: "Beranda", icon: Home },
  { path: "/guide", label: "Panduan", icon: Map },
  { path: "/learn", label: "Belajar", icon: BookOpen },
  { path: "/kanji", label: "Kanji", icon: Layers },
  { path: "/quiz", label: "Kuis", icon: Puzzle },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { isSyncing } = useProgress();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isLoggedIn = status === "authenticated";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-2xl rounded-2xl ring-1 ring-black/5">
        <ul className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path} className="relative">
                <Link
                  href={item.path}
                  className={cn(
                    "relative flex flex-col items-center justify-center px-3 py-2 md:px-4 md:py-2.5 rounded-xl transition-all duration-300 z-10 gap-1",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                  )}
                >
                  {/* Background Bubble for Active State */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-bubble"
                      className="absolute inset-0 bg-indigo-100 dark:bg-slate-800 rounded-xl"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  {/* Icon & Label */}
                  {item.path === "/" ? (
                    <div
                      className={cn(
                        "relative z-10 w-10 h-10 transition-transform",
                        isActive && "scale-110",
                      )}
                    >
                      <Image
                        src="/assets/home.png"
                        alt="Home"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <>
                      <Icon
                        className={cn(
                          "relative z-10 w-5 h-5 transition-transform",
                          isActive && "scale-110",
                        )}
                      />
                      <span
                        className={cn(
                          "relative z-10 text-[10px] md:text-xs font-semibold",
                          isActive ? "text-indigo-700" : "text-slate-500",
                        )}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200 mx-1" />

        {/* User Section */}
        <div className="relative">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                )}
                {/* Sync indicator */}
                {isSyncing ? (
                  <Cloud className="w-3 h-3 text-indigo-500 animate-pulse" />
                ) : (
                  <Cloud className="w-3 h-3 text-green-500" />
                )}
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                >
                  <div className="p-3 border-b border-slate-100">
                    <div className="font-semibold text-slate-800 truncate">
                      {session.user?.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {session.user?.email}
                    </div>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline">Masuk</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
