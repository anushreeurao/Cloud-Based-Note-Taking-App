import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Archive,
  Brush,
  LogOut,
  MoonStar,
  Plus,
  SunMedium,
  Trash2,
  History,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useUIStore } from "../../store/useUIStore";
import { NotesProvider } from "../../contexts/NotesContext";
import { NoteEditorModal } from "../notes/NoteEditorModal";

const moods = [
  { id: "focus", label: "Focus" },
  { id: "flow", label: "Flow" },
  { id: "calm", label: "Calm" },
];

function SideNav() {
  const location = useLocation();
  const { logout } = useAuth();
  const { theme, setTheme, mood, setMood } = useUIStore();

  const navItems = [
    { to: "/", label: "Notes" },
    { to: "/archive", label: "Archive", icon: Archive },
    { to: "/trash", label: "Trash", icon: Trash2 },
    { to: "/studio", label: "Scribble Studio", icon: Brush },
    { to: "/timeline", label: "Timeline", icon: History },
  ];

  return (
    <aside className="glass-panel sticky top-4 flex h-[calc(100vh-2rem)] w-full flex-col rounded-3xl p-5 md:w-[290px]">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/75">Prism</p>
        <h2 className="font-display text-3xl text-white">Notes OS</h2>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-white/15 text-white shadow-glow"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              {Icon ? <Icon className="h-4 w-4" /> : null}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs uppercase tracking-[0.15em] text-slate-300">Theme</p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setTheme("light")}
            className={`flex-1 rounded-xl px-3 py-2 text-xs ${
              theme === "light" ? "bg-white text-slate-900" : "bg-white/10 text-slate-200"
            }`}
          >
            <SunMedium className="mx-auto h-4 w-4" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex-1 rounded-xl px-3 py-2 text-xs ${
              theme === "dark" ? "bg-white text-slate-900" : "bg-white/10 text-slate-200"
            }`}
          >
            <MoonStar className="mx-auto h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs uppercase tracking-[0.15em] text-slate-300">Mood</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {moods.map((item) => (
            <button
              key={item.id}
              onClick={() => setMood(item.id)}
              className={`rounded-lg px-2 py-1 text-xs ${
                mood === item.id ? "bg-cyan-200/20 text-cyan-100" : "bg-white/10 text-slate-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={logout}
        className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  );
}

export function AppShell() {
  const { openEditor } = useUIStore();

  return (
    <NotesProvider>
      <div className="min-h-screen bg-base-900 bg-ambient-radial p-4 text-white">
        <div className="mx-auto flex w-full max-w-[1440px] gap-4 md:gap-6">
          <SideNav />

          <main className="relative min-h-[calc(100vh-2rem)] flex-1">
            <Outlet />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openEditor()}
              className="fixed bottom-8 right-8 z-40 inline-flex items-center gap-2 rounded-full border border-cyan-200/40 bg-cyan-200/20 px-5 py-3 text-sm font-semibold text-cyan-50 shadow-glow backdrop-blur-xl"
            >
              <Plus className="h-4 w-4" />
              Create Note
            </motion.button>
            <NoteEditorModal />
          </main>
        </div>
      </div>
    </NotesProvider>
  );
}
