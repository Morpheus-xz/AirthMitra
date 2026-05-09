import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "ArthMitra AI — India's Business Companion",
  description: "India's AI-powered MSME compliance, growth, and expert network platform. GST, government schemes, Bahi Khata, and more.",
  keywords: "MSME, GST compliance, government schemes, Indian small business, Bahi Khata, CA consultation",
  openGraph: {
    title: "ArthMitra AI — India's Business Companion",
    description: "Manage your business compliance with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
