import React from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ServerSelect from './pages/ServerSelect';
import Login from './pages/Login';
import ServerScope from './components/ServerScope';
import RequireAuth from './components/RequireAuth';
import ArcaneBackdrop from './components/ArcaneBackdrop';
import { getServerById } from '@/lib/servers';

// แสดงชื่อเซิฟปัจจุบัน + ลิงก์ "เปลี่ยนเซิฟ" เฉพาะตอนที่อยู่ในหน้า /s/:serverId เท่านั้น
const CurrentServerBadge = () => {
  const { serverId } = useParams();
  const server = getServerById(serverId);
  if (!server) return null;

  return (
    <Link
      to="/"
      className="flex items-center gap-2 rounded-full border border-gold/30 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground no-underline transition-colors hover:border-gold/50 hover:text-gold"
    >
      <i className="bx bx-server text-sm text-gold/70" />
      <span className="font-heading tracking-wide text-foreground">{server.name}</span>
      <span className="hidden items-center gap-1 sm:flex">
        <i className="bx bx-transfer-alt text-[13px]" /> เปลี่ยนเซิฟ
      </span>
    </Link>
  );
};

function App() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <ArcaneBackdrop />
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
                <span className="absolute inset-[3px] rounded-full border border-gold/25" />
                <span className="relative bg-gradient-to-br from-[oklch(0.88_0.08_90)] via-gold to-[oklch(0.55_0.1_75)] bg-clip-text font-heading text-[13px] font-bold tracking-[0.04em] text-transparent transition-transform duration-500 group-hover:scale-110">
                  JKM
                </span>
              </span>
            </span>

            <span className="flex flex-col leading-tight">
              <span className="bg-gradient-to-r from-white via-gold/80 to-white bg-clip-text font-heading text-lg font-bold tracking-[0.05em] text-transparent sm:text-xl">
                Joe K Muller
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

          <Routes>
            <Route path="/s/:serverId/*" element={<CurrentServerBadge />} />
          </Routes>
        </div>
      </nav>

      <main className="relative z-10 mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 sm:px-6">
        <Routes>
          <Route path="/" element={<ServerSelect />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/s/:serverId"
            element={
              <ServerScope>
                <Home />
              </ServerScope>
            }
          />
          <Route
            path="/s/:serverId/admin"
            element={
              <RequireAuth>
                <ServerScope>
                  <Admin />
                </ServerScope>
              </RequireAuth>
            }
          />
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
