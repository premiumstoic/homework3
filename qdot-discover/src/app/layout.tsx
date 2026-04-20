import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "QDot Discover",
  description: "Interactive quantum dot discovery dashboard and report built from ViNAS nanoparticle data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <Navbar />
        <main className="flex min-h-[calc(100vh-9rem)] flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
