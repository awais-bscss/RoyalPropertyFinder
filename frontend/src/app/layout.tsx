import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { ReduxProvider } from "@/providers/redux-provider";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Royal Property Finder",
  description: "Find your dream home with Royal Property Finder",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthToastWatcher } from "@/components/auth/AuthToastWatcher";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${lato.variable} antialiased font-sans`}
      >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Suspense fallback={null}>
               <AuthToastWatcher />
            </Suspense>
            {children}
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
