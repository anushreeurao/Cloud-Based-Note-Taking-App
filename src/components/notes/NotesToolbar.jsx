import { Search, SlidersHorizontal } from "lucide-react";
import { PRIORITY_LEVELS } from "../../utils/priority";
import { useUIStore } from "../../store/useUIStore";

export function NotesToolbar({ tags = [] }) {
  const { search, setSearch, filters, setFilters } = useUIStore();

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, text, tags..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-300/40"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-300" />
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ priority: e.target.value })}
            className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-xs text-white"
          >
            <option value="all">Priority: All</option>
            {PRIORITY_LEVELS.map((priority) => (
              <option key={priority} value={priority}>
                Priority: {priority}
              </option>
            ))}
          </select>

          <select
            value={filters.mediaType}
            onChange={(e) => setFilters({ mediaType: e.target.value })}
            className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-xs text-white"
          >
            <option value="all">Media: All</option>
            <option value="image">Images</option>
            <option value="audio">Audio</option>
            <option value="scribble">Scribbles</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value })}
            className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-xs text-white"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>

          <select
            value={filters.tags[0] || "all"}
            onChange={(e) =>
              setFilters({ tags: e.target.value === "all" ? [] : [e.target.value] })
            }
            className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-xs text-white"
          >
            <option value="all">Tags: All</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
