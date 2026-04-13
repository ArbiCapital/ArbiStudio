import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type AnimationStyle =
  | "fade-up"
  | "fade-down"
  | "scale"
  | "typewriter"
  | "slide-left"
  | "slide-right"
  | "blur-in"
  | "bounce";

interface AnimatedTitleProps {
  text: string;
  style?: AnimationStyle;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  startFrame?: number;
  durationFrames?: number;
}

export function AnimatedTitle({
  text,
  style = "fade-up",
  fontSize = 64,
  color = "#ffffff",
  fontFamily = "Inter, sans-serif",
  startFrame = 0,
  durationFrames = 30,
}: AnimatedTitleProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relFrame = frame - startFrame;

  if (relFrame < 0) return null;

  const progress = Math.min(relFrame / durationFrames, 1);

  const animations: Record<AnimationStyle, React.CSSProperties> = {
    "fade-up": {
      opacity: interpolate(relFrame, [0, durationFrames], [0, 1], { extrapolateRight: "clamp" }),
      transform: `translateY(${interpolate(relFrame, [0, durationFrames], [40, 0], { extrapolateRight: "clamp" })}px)`,
    },
    "fade-down": {
      opacity: interpolate(relFrame, [0, durationFrames], [0, 1], { extrapolateRight: "clamp" }),
      transform: `translateY(${interpolate(relFrame, [0, durationFrames], [-40, 0], { extrapolateRight: "clamp" })}px)`,
    },
    scale: {
      opacity: interpolate(relFrame, [0, durationFrames * 0.3], [0, 1], { extrapolateRight: "clamp" }),
      transform: `scale(${interpolate(relFrame, [0, durationFrames], [0.5, 1], { extrapolateRight: "clamp" })})`,
    },
    typewriter: {
      opacity: 1,
      clipPath: `inset(0 ${interpolate(relFrame, [0, durationFrames], [100, 0], { extrapolateRight: "clamp" })}% 0 0)`,
    },
    "slide-left": {
      opacity: interpolate(relFrame, [0, durationFrames * 0.5], [0, 1], { extrapolateRight: "clamp" }),
      transform: `translateX(${interpolate(relFrame, [0, durationFrames], [100, 0], { extrapolateRight: "clamp" })}px)`,
    },
    "slide-right": {
      opacity: interpolate(relFrame, [0, durationFrames * 0.5], [0, 1], { extrapolateRight: "clamp" }),
      transform: `translateX(${interpolate(relFrame, [0, durationFrames], [-100, 0], { extrapolateRight: "clamp" })}px)`,
    },
    "blur-in": {
      opacity: interpolate(relFrame, [0, durationFrames], [0, 1], { extrapolateRight: "clamp" }),
      filter: `blur(${interpolate(relFrame, [0, durationFrames], [20, 0], { extrapolateRight: "clamp" })}px)`,
    },
    bounce: {
      opacity: interpolate(relFrame, [0, durationFrames * 0.2], [0, 1], { extrapolateRight: "clamp" }),
      transform: `scale(${1 + Math.sin(progress * Math.PI) * 0.2})`,
    },
  };

  return (
    <div
      style={{
        fontSize,
        color,
        fontFamily,
        fontWeight: 700,
        textAlign: "center",
        ...animations[style],
      }}
    >
      {text}
    </div>
  );
}
