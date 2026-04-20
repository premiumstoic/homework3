export function Footer() {
  return (
    <footer className="border-t border-border/75 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-medium text-foreground">QDot Discover</p>
          <p>Interactive report and discovery dashboard for ViNAS quantum dot nanoparticles.</p>
        </div>
        <div className="text-left md:text-right">
          <p className="font-mono text-xs uppercase tracking-[0.22em]">MAT306 • Next.js • Vercel ready</p>
          <p>Phase 1 shared shell and discovery library.</p>
        </div>
      </div>
    </footer>
  );
}
