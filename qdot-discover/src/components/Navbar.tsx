"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Atom, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Interactive Report" },
  { href: "/discover", label: "Discover" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/75 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          className="flex items-center gap-3 rounded-full border border-border/70 bg-card/70 px-3 py-2 transition hover:border-primary/35 hover:bg-card"
          href="/"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/12 text-primary shadow-[0_0_24px_rgba(37,99,235,0.18)]">
            <Atom className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[0.16em] text-foreground">QDot Discover</div>
            <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground">
              ViNAS dashboard
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_12px_30px_rgba(37,99,235,0.22)]"
                    : "text-foreground/72 hover:bg-card hover:text-foreground",
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Button
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          size="icon"
          type="button"
          variant="outline"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-border/70 bg-background/92 px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.16)] md:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "border-primary/35 bg-primary/12 text-primary"
                      : "border-border/70 bg-card/60 text-foreground/80 hover:text-foreground",
                  )}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
