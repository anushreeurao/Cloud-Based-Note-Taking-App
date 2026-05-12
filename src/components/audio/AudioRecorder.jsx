import { useMemo, useRef, useState } from "react";
import { Mic, PauseCircle, PlayCircle, Save, StopCircle } from "lucide-react";
import toast from "react-hot-toast";

export function AudioRecorder({ onSave }) {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const startAtRef = useRef(0);

  const durationLabel = useMemo(() => `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, "0")}`, [duration]);

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      setDuration(0);
      startAtRef.current = Date.now();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecording(false);
        setPaused(false);
        cleanupStream();
      };
      recorder.start(300);
      setRecording(true);
      setPaused(false);
      toast.success("Recording started.");

      const timer = setInterval(() => {
        if (!paused && recorder.state === "recording") {
          setDuration(Math.floor((Date.now() - startAtRef.current) / 1000));
        }
      }, 500);
      recorder.onstop = () => {
        clearInterval(timer);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecording(false);
        setPaused(false);
        cleanupStream();
      };
    } catch {
      toast.error("Mic permission denied or unavailable.");
    }
  };

  const togglePause = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (recorder.state === "recording") {
      recorder.pause();
      setPaused(true);
    } else if (recorder.state === "paused") {
      recorder.resume();
      setPaused(false);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    recorder.stop();
  };

  const saveRecording = async () => {
    if (!audioBlob) return;
    const file = new File([audioBlob], `voice-note-${Date.now()}.webm`, {
      type: audioBlob.type,
    });
    await onSave(file, duration);
    toast.success("Audio attached.");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-xs uppercase tracking-[0.15em] text-slate-300">Audio</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={startRecording}
          disabled={recording}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white disabled:opacity-50"
        >
          <Mic className="h-4 w-4" />
          Record
        </button>
        <button
          type="button"
          onClick={togglePause}
          disabled={!recording}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white disabled:opacity-50"
        >
          {paused ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          onClick={stopRecording}
          disabled={!recording}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white disabled:opacity-50"
        >
          <StopCircle className="h-4 w-4" />
          Stop
        </button>
        <span className="text-xs text-slate-300">{durationLabel}</span>
      </div>
      {audioUrl ? (
        <div className="mt-3 space-y-2">
          <audio controls src={audioUrl} className="w-full" />
          <button
            type="button"
            onClick={saveRecording}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/35 bg-cyan-300/20 px-3 py-1.5 text-xs text-cyan-100"
          >
            <Save className="h-4 w-4" />
            Attach audio
          </button>
        </div>
      ) : null}
    </div>
  );
}
