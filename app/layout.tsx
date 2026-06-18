import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flowity.iq",
  description: "Gestión inteligente de tu negocio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <div className="flex-1">{children}</div>
          <footer className="border-t py-3 px-6 lg:pl-70 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              © Flowity.iq {new Date().getFullYear()}
            </span>
            <span>v1.0</span>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
