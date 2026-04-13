import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedTitle } from "../components/animated-title";

type TextLine = {
  text: string;
  style?: "fade-up" | "fade-down" | "scale" | "typewriter" | "slide-left" | "slide-right" | "blur-in" | "bounce";
  fontSize?: number;
  color?: string;
  delayInSeconds?: number;
};

type TextPromoProps = {
  lines: TextLine[];
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
  backgroundPattern?: "none" | "grid" | "dots" | "gradient-mesh";
};

function BackgroundPattern({
  pattern,
  accentColor,
  frame,
  fps,
  width,
  height,
}: {
  pattern: string;
  accentColor: string;
  frame: number;
  fps: number;
  width: number;
  height: number;
}) {
  if (pattern === "none") return null;

  const slowDrift = interpolate(frame, [0, 10 * fps], [0, 360], {
    extrapolateRight: "extend",
  });

  if (pattern === "grid") {
    return (
      <AbsoluteFill
        style={{
          opacity: 0.06,
          backgroundImage: `
            linear-gradient(${accentColor} 1px, transparent 1px),
            linear-gradient(90deg, ${accentColor} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `rotate(${slowDrift * 0.01}deg)`,
        }}
      />
    );
  }

  if (pattern === "dots") {
    return (
      <AbsoluteFill
        style={{
          opacity: 0.08,
          backgroundImage: `radial-gradient(circle, ${accentColor} 1.5px, transparent 1.5px)`,
          backgroundSize: "40px 40px",
        }}
      />
    );
  }

  if (pattern === "gradient-mesh") {
    return (
      <AbsoluteFill
        style={{
          opacity: 0.3,
          background: `
            radial-gradient(ellipse at ${30 + Math.sin(slowDrift * 0.02) * 20}% ${40 + Math.cos(slowDrift * 0.015) * 20}%, ${accentColor}44 0%, transparent 60%),
            radial-gradient(ellipse at ${70 + Math.cos(slowDrift * 0.018) * 15}% ${60 + Math.sin(slowDrift * 0.012) * 15}%, ${accentColor}33 0%, transparent 50%)
          `,
        }}
      />
    );
  }

  return null;
}

export function TextPromo({
  lines,
  backgroundColor = "#0a0a0a",
  accentColor = "#6366f1",
  textColor = "#ffffff",
  backgroundPattern = "gradient-mesh",
}: TextPromoProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Calculate vertical positioning
  const totalLines = lines.length;
  const lineSpacing = Math.min(height / (totalLines + 2), 160);
  const startY = (height - totalLines * lineSpacing) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Background pattern */}
      <BackgroundPattern
        pattern={backgroundPattern}
        accentColor={accentColor}
        frame={frame}
        fps={fps}
        width={width}
        height={height}
      />

      {/* Kinetic text lines */}
      {lines.map((line, index) => {
        const delay = Math.round((line.delayInSeconds ?? index * 0.4) * fps);
        const defaultFontSize = Math.round(width * 0.04);

        return (
          <Sequence key={index} from={delay} premountFor={fps}>
            <AbsoluteFill
              style={{
                justifyContent: "center",
                alignItems: "center",
                top: startY + index * lineSpacing - height / 2,
              }}
            >
              <AnimatedTitle
                text={line.text}
                style={line.style ?? "fade-up"}
                fontSize={line.fontSize ?? defaultFontSize}
                color={line.color ?? textColor}
                durationFrames={Math.round(0.6 * fps)}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Accent bar at bottom */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: interpolate(frame, [0, Math.round(3 * fps)], [0, width * 0.3], {
              extrapolateRight: "clamp",
            }),
            height: 4,
            backgroundColor: accentColor,
            borderRadius: 2,
            marginBottom: height * 0.06,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
