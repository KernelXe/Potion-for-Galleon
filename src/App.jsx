import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="sticky top-0 z-50">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/95 via-background/90 to-background/75 backdrop-blur-xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 -bottom-2 h-2 bg-gradient-to-b from-gold/[0.04] to-transparent" />

        <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <Link
            to="/"
            className="group flex items-center gap-3 no-underline sm:gap-4"
          >
            <span className="relative flex shrink-0 items-center justify-center">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/35 via-primary/20 to-transparent opacity-50 blur-lg transition-opacity duration-500 group-hover:opacity-90"
              />
              <span className="relative flex size-11 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-br from-card via-card/80 to-background shadow-[inset_0_1px_0_0_oklch(0.76_0.12_85/0.2)]">
                <i className="bx bx-flask-round text-[22px] text-gold transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110" />
              </span>
            </span>

            <span className="flex flex-col leading-tight">
              <span className="bg-gradient-to-r from-white via-gold/80 to-white bg-clip-text font-heading text-lg font-bold tracking-[0.05em] text-transparent sm:text-xl">
                Potion for Galleon
              </span>
              <span className="mt-1 hidden items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80 sm:flex">
                <span aria-hidden className="block h-px w-3 bg-gold/45" />
                Recipes &amp; Material Calculator
                <span aria-hidden className="block h-px w-3 bg-gold/45" />
              </span>
              <span className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 sm:hidden">
                Recipes &amp; Calculator
              </span>
            </span>
          </Link>

          <span
            aria-hidden
            className="hidden items-center gap-3 text-gold/45 md:flex"
          >
            <i className="bx bx-star text-[10px]" />
            <span className="block h-px w-10 bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
            <i className="bxf bx-star text-sm text-gold/65" />
            <span className="block h-px w-10 bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
            <i className="bx bx-star text-[10px]" />
          </span>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 sm:px-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <footer className="relative mt-auto">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        <div className="mx-auto flex max-w-[1100px] items-center justify-center gap-3 px-6 py-6 text-muted-foreground">
          <span aria-hidden className="block h-px w-8 bg-gold/25" />
          <p className="text-[11px] uppercase tracking-[0.28em]">
            © 2026 <span className="text-foreground">Kernelxz</span>
          </p>
          <span aria-hidden className="block h-px w-8 bg-gold/25" />
        </div>
      </footer>

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
