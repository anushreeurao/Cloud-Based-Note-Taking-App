import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, CloudCog, AudioLines } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthPage() {
  const { user, loading, loginWithGoogle } = useAuth();

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-base-900 bg-ambient-radial px-6 py-10 text-white">
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -right-28 bottom-4 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-3xl p-8"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-200/10 px-3 py-1 text-xs font-medium text-cyan-100">
            <Sparkles className="h-3.5 w-3.5" />
            Future-ready knowledge hub
          </p>
          <h1 className="mt-5 font-display text-4xl leading-tight md:text-5xl">
            Prism Notes
          </h1>
          <p className="mt-4 max-w-md text-slate-200">
            Capture text, sketches, images, and voice in one intelligent workspace with real-time sync and premium interaction design.
          </p>

          <button
            onClick={loginWithGoogle}
            className="mt-8 inline-flex items-center justify-center rounded-2xl border border-cyan-200/30 bg-white/95 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:scale-[1.02]"
          >
            Continue with Google
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 }}
          className="grid gap-4"
        >
          {[
            { icon: ShieldCheck, title: "Secure", body: "Google Auth + user-scoped Firestore documents." },
            { icon: CloudCog, title: "Resilient", body: "Realtime sync with offline persistence caching." },
            { icon: AudioLines, title: "Multimedia", body: "Rich text, audio notes, images, and sketches." },
          ].map((item) => (
            <div key={item.title} className="glass-panel rounded-2xl p-5">
              <item.icon className="h-5 w-5 text-cyan-200" />
              <h3 className="mt-3 font-display text-xl text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-200">{item.body}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
