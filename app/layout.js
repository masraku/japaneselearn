import "./globals.css";
import Navbar from "@/components/Navbar";
import { ProgressProvider } from "@/lib/progress-context";
import { AuthProvider } from "@/lib/auth-provider";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "RakuGo らく語 - Belajar Bahasa Jepang",
  description:
    "Belajar Hiragana, Katakana, dan Kanji dengan mudah & santai. Platform interaktif untuk JLPT N5–N3.",
  keywords: [
    "belajar bahasa jepang",
    "hiragana",
    "katakana",
    "kanji",
    "JLPT",
    "N5",
    "N3",
    "RakuGo",
    "らく語",
  ],
  authors: [{ name: "RakuGo Team" }],
  creator: "RakuGo",
  metadataBase: new URL("https://rakugo.studio"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://rakugo.studio",
    siteName: "RakuGo らく語",
    title: "RakuGo らく語 - Belajar Bahasa Jepang dengan Santai",
    description:
      "Platform interaktif untuk belajar Hiragana, Katakana, dan Kanji. Siap menghadapi JLPT N5–N3!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RakuGo - Belajar Bahasa Jepang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RakuGo らく語 - Belajar Bahasa Jepang",
    description:
      "Belajar Hiragana, Katakana, dan Kanji dengan mudah & santai.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${font.className} bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 antialiased overflow-x-hidden transition-colors`}
      >
        <AuthProvider>
          <ProgressProvider>
            <main className="max-w-6xl mx-auto px-4 py-8 pb-32 relative z-10 min-h-screen">
              {children}
            </main>
            <Navbar />
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
