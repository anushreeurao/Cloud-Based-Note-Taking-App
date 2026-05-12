import { Image, Headphones, Brush } from "lucide-react";

export function MediaStrip({ media = [] }) {
  if (!media.length) return null;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap gap-2">
        {media.slice(0, 4).map((item) => {
          if (item.type === "image" || item.type === "scribble") {
            return (
              <img
                key={item.url}
                src={item.url}
                alt={item.name || item.type}
                className="h-16 w-16 rounded-lg border border-white/10 object-cover"
              />
            );
          }

          return (
            <div
              key={item.url}
              className="inline-flex h-16 w-16 items-center justify-center rounded-lg border border-white/10 bg-white/5"
            >
              <Headphones className="h-5 w-5 text-cyan-100" />
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1">
          <Image className="h-3 w-3" />
          {media.filter((item) => item.type === "image").length} Images
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1">
          <Headphones className="h-3 w-3" />
          {media.filter((item) => item.type === "audio").length} Audio
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1">
          <Brush className="h-3 w-3" />
          {media.filter((item) => item.type === "scribble").length} Scribbles
        </span>
      </div>
    </div>
  );
}
