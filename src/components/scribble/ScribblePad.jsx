import { useEffect, useRef, useState } from "react";
import { Eraser, Minus, PencilLine, Square, Circle, Save } from "lucide-react";

const tools = [
  { id: "draw", label: "Draw", icon: PencilLine },
  { id: "line", label: "Line", icon: Minus },
  { id: "rect", label: "Rect", icon: Square },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "erase", label: "Erase", icon: Eraser },
];

export function ScribblePad({ onSave }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState("draw");
  const [color, setColor] = useState("#9FE6FF");
  const [size, setSize] = useState(3);
  const [startPoint, setStartPoint] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext("2d");
    ctx.scale(ratio, ratio);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#091226";
    ctx.fillRect(0, 0, width, height);
    ctxRef.current = ctx;
  }, []);

  const pointer = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const begin = (event) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const p = pointer(event);
    setDrawing(true);
    setStartPoint(p);
    if (tool === "draw" || tool === "erase") {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }
  };

  const move = (event) => {
    if (!drawing) return;
    const ctx = ctxRef.current;
    const p = pointer(event);
    if (!ctx) return;

    if (tool === "draw" || tool === "erase") {
      ctx.globalCompositeOperation = tool === "erase" ? "destination-out" : "source-over";
      ctx.strokeStyle = tool === "erase" ? "rgba(0,0,0,1)" : color;
      ctx.lineWidth = size;
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  };

  const end = (event) => {
    if (!drawing) return;
    const ctx = ctxRef.current;
    const p = pointer(event);
    if (!ctx) return;

    if (tool === "line" && startPoint) {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    if (tool === "rect" && startPoint) {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.strokeRect(startPoint.x, startPoint.y, p.x - startPoint.x, p.y - startPoint.y);
    }

    if (tool === "circle" && startPoint) {
      const radius = Math.hypot(p.x - startPoint.x, p.y - startPoint.y);
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    setDrawing(false);
    setStartPoint(null);
    ctx.beginPath();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#091226";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  };

  const saveAsImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) return;
    const file = new File([blob], `scribble-${Date.now()}.png`, { type: "image/png" });
    await onSave(file);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {tools.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTool(item.id)}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs ${
              tool === item.id
                ? "border-cyan-300/50 bg-cyan-300/20 text-cyan-100"
                : "border-white/15 bg-white/10 text-slate-200"
            }`}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-8 w-8 rounded-lg border border-white/15 bg-transparent"
        />
        <input
          type="range"
          min={1}
          max={14}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        />
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs text-white"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={saveAsImage}
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/40 bg-cyan-300/20 px-3 py-1 text-xs text-cyan-100"
        >
          <Save className="h-3.5 w-3.5" />
          Save Scribble
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="h-[280px] w-full rounded-xl border border-white/10 bg-[#091226]"
        onPointerDown={begin}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
      />
    </div>
  );
}
