const CATEGORY_RULES = [
  { key: "work", words: ["meeting", "client", "project", "deadline", "roadmap"] },
  { key: "study", words: ["exam", "lecture", "course", "study", "revision"] },
  { key: "health", words: ["doctor", "workout", "diet", "sleep", "mindfulness"] },
  { key: "finance", words: ["invoice", "budget", "expense", "payment", "tax"] },
];

export function summarizeNoteText(text = "") {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
  const short = sentences.slice(0, 2).join(" ");
  return short.length > 210 ? `${short.slice(0, 207)}...` : short;
}

export function suggestCategory({ title = "", text = "", tags = [] }) {
  const haystack = `${title} ${text} ${tags.join(" ")}`.toLowerCase();
  const match = CATEGORY_RULES.find(({ words }) => words.some((word) => haystack.includes(word)));
  return match?.key ?? "general";
}
