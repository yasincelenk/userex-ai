import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UserEx AI Assistant",
  description: "AI Chatbot Assistant",
};

import { ConditionalAuthProvider } from "@/components/conditional-auth-provider";
import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsent } from "@/components/cookie-consent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <ConditionalAuthProvider>
            <CookieConsent />
            {children}
          </ConditionalAuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
