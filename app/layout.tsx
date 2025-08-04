import { cn } from "@/lib/utils";
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" }); // Añade `variable` aquí

export const metadata: Metadata = {
  title: "Motordil Comparador y Subastas",
  description: "Comparador de vehículos y plataforma de subastas",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <head></head>
      <body className={cn(inter.className, "bg-white dark:bg-gray-950")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
