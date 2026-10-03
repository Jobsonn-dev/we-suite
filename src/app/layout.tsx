import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WEBUOS — Global Business Discovery Platform",
  description:
    "World Enterprises Business Unified Operating System. Search and discover companies, products, services, industries, technologies and locations across the global business ecosystem.",
  keywords: [
    "WEBUOS",
    "Business Search",
    "Business Discovery",
    "Companies",
    "Products",
    "Services",
    "Industries",
    "Technologies",
    "B2B",
    "Manufacturers",
    "Suppliers",
  ],
  authors: [{ name: "WEBUOS" }],
  icons: {
    icon: "/webuos-brand.png",
  },
  openGraph: {
    title: "WEBUOS — Global Business Discovery Platform",
    description:
      "World Enterprises Business Unified Operating System. Search and discover the global business ecosystem.",
    siteName: "WEBUOS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WEBUOS — Global Business Discovery Platform",
    description:
      "Search companies, products, services, industries, technologies and locations worldwide.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Apply persisted theme before hydration to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('webuos-theme')||'system';var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;var el=document.documentElement;el.classList.toggle('dark',r==='dark');el.style.colorScheme=r;}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
