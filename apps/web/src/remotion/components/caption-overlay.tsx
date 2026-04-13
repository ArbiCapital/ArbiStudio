import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type CaptionStyle = "tiktok-bold" | "minimal" | "outline" | "gradient" | "karaoke";

interface CaptionWord {
  text: string;
  start: number; // seconds
  end: number;   // seconds
}

interface CaptionOverlayProps {
  words: CaptionWord[];
  style?: CaptionStyle;
  fontSize?: number;
  color?: string;
  highlightColor?: string;
  position?: "bottom" | "center" | "top";
  maxWordsPerLine?: number;
}

export function CaptionOverlay({
  words,
  style = "tiktok-bold",
  fontSize = 48,
  color = "#ffffff",
  highlightColor = "#FFD700",
  position = "bottom",
  maxWordsPerLine = 4,
}: CaptionOverlayProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find current words to display
  const activeWords = words.filter(
    (w) => currentTime >= w.start && currentTime <= w.end + 0.5
  );

  if (activeWords.length === 0) return null;

  // Group into lines
  const lines: CaptionWord[][] = [];
  for (let i = 0; i < activeWords.length; i += maxWordsPerLine) {
    lines.push(activeWords.slice(i, i + maxWordsPerLine));
  }

  const positionStyle: Record<string, React.CSSProperties> = {
    bottom: { bottom: 80, left: 0, right: 0 },
    center: { top: "50%", left: 0, right: 0, transform: "translateY(-50%)" },
    top: { top: 80, left: 0, right: 0 },
  };

  const STYLE_MAP: Record<CaptionStyle, (isActive: boolean) => React.CSSProperties> = {
    "tiktok-bold": (isActive) => ({
      fontSize,
      fontWeight: 900,
      color: isActive ? highlightColor : color,
      textShadow: "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
      textTransform: "uppercase" as const,
      letterSpacing: "0.02em",
    }),
    minimal: (isActive) => ({
      fontSize: fontSize * 0.8,
      fontWeight: 500,
      color: isActive ? color : "rgba(255,255,255,0.7)",
      textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
    }),
    outline: (isActive) => ({
      fontSize,
      fontWeight: 800,
      color: "transparent",
      WebkitTextStroke: isActive ? `2px ${highlightColor}` : `2px ${color}`,
    }),
    gradient: (isActive) => ({
      fontSize,
      fontWeight: 800,
      background: isActive
        ? `linear-gradient(135deg, ${highlightColor}, #FF6B6B)`
        : `linear-gradient(135deg, ${color}, #cccccc)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textShadow: "none",
    }),
    karaoke: (isActive) => ({
      fontSize,
      fontWeight: 700,
      color: isActive ? highlightColor : "rgba(255,255,255,0.4)",
      textShadow: isActive ? `0 0 20px ${highlightColor}` : "none",
      transition: "all 0.1s",
    }),
  };

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyle[position],
        textAlign: "center",
        padding: "0 40px",
        zIndex: 10,
      }}
    >
      {lines.map((line, lineIdx) => (
        <div key={lineIdx} style={{ marginBottom: 8 }}>
          {line.map((word, wordIdx) => {
            const isActive = currentTime >= word.start && currentTime <= word.end;
            return (
              <span
                key={wordIdx}
                style={{
                  ...STYLE_MAP[style](isActive),
                  display: "inline-block",
                  margin: "0 6px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
