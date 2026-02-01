import "./globals.css";
import Navbar from "@/components/Navbar";
import { ProgressProvider } from "@/lib/progress-context";

export const metadata = {
  title: "Japanese Learning App",
  description: "Learn Kanji and JLPT N5–N3 interactively",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <ProgressProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-6">
            {children}
          </main>
        </ProgressProvider>
      </body>
    </html>
  );
}
