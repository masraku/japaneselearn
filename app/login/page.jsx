"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Cloud, Radio, Trophy, ArrowRight, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-900 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="flex w-full max-w-5xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/5 min-h-[600px]">
          {/* Left Side - Visuals & Branding (Hidden on mobile) */}
          <div className="hidden md:flex w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
            {/* Simple gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900/90" />

            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-cover mix-blend-overlay" />

            {/* Floating Elements - Repositioned to safe zones */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-8 right-8 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-20"
            >
              <span className="text-4xl filter drop-shadow-lg">あ</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 7,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-8 right-8 p-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-20"
            >
              <span className="text-xl font-medium filter drop-shadow-lg">
                ⚡ Streak: 5
              </span>
            </motion.div>

            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 8,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute top-1/2 right-[-20px] w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl"
            />

            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                RakuGo <span className="opacity-80 font-normal">らく語</span>
              </h1>
              <p className="opacity-90 font-light tracking-wide">
                Solusi belajar bahasa Jepang yang cerdas & santai.
              </p>
            </div>

            <div className="space-y-6 relative z-10 pt-12">
              <FeatureItem
                icon={<Cloud className="w-5 h-5 text-indigo-300" />}
                title="Progress Tersimpan di Cloud"
                desc="Tak perlu takut kehilangan data belajarmu."
              />
              <FeatureItem
                icon={<Radio className="w-5 h-5 text-indigo-300" />}
                title="Sinkronisasi Otomatis"
                desc="Lanjutkan pelajaran di perangkat manapun."
              />
              <FeatureItem
                icon={<Trophy className="w-5 h-5 text-indigo-300" />}
                title="Riwayat Kuis & Pencapaian"
                desc="Pantau perkembangan kemampuanmu setiap hari."
              />
            </div>

            <div className="text-xs opacity-60 relative z-10">
              © {new Date().getFullYear()} RakuGo Learning Platform.
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center items-center text-center bg-white/50 dark:bg-transparent">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm"
            >
              <div className="mb-10">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 text-white">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                  Selamat Datang!
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Mulai perjalananmu menguasai Bahasa Jepang hari ini.
                </p>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full group relative flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-2xl font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 active:scale-[0.98]"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-6 h-6"
                />
                <span className="text-lg">Masuk dengan Google</span>
                <ArrowRight className="w-5 h-5 absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-500" />
              </button>

              <div className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-400 font-medium">
                <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-700"></span>
                <span>DATA AMAN & PRIVAT</span>
                <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-700"></span>
              </div>

              <p className="mt-8 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Dengan melanjutkan, kamu menyetujui{" "}
                <a href="#" className="underline hover:text-indigo-500">
                  Syarat & Ketentuan
                </a>{" "}
                serta{" "}
                <a href="#" className="underline hover:text-indigo-500">
                  Kebijakan Privasi
                </a>{" "}
                kami.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors">
      <div className="mt-1 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg leading-tight mb-1">{title}</h3>
        <p className="text-sm opacity-80 leading-relaxed font-light">{desc}</p>
      </div>
    </div>
  );
}
