import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "shape.me - Tu Rutina Personalizada",
  description: "Planes personalizados de entrenamiento, dieta y sueño para tus objetivos",
  manifest: "/manifest.json",
  themeColor: "#dc2626",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#dc2626" />
      </head>
      <body className={`${inter.className} antialiased bg-gradient-to-br from-black via-red-950 to-black min-h-screen`}>
        <UserProvider>
          <div className="min-h-screen text-white">
            {children}
          </div>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}