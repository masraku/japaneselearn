"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path) =>
    pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-500";

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          🇯🇵 JLearn
        </Link>

        <div className="flex gap-6">
          <Link href="/learn" className={linkClass("/learn")}>
            Learn
          </Link>
          <Link href="/kanji" className={linkClass("/kanji")}>
            Kanji
          </Link>
          <Link href="/quiz" className={linkClass("/quiz")}>
            Quiz
          </Link>
        </div>
      </div>
    </nav>
  );
}
