import type { Metadata, Viewport } from "next";
import "./globals.css";
import FloatingNav from "@/components/ui/FloatingNav";

export const metadata: Metadata = {
  title: "Ramón y Cajal F5",
  description: "Gestión de partidos de fútbol 5",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#080c14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="text-text-primary min-h-screen">
        <div className="min-h-screen pb-28">
          {children}
        </div>
        <FloatingNav />
      </body>
    </html>
  );
}
