import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedTitle } from "../components/animated-title";

type BeforeAfterProps = {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
  revealDirection?: "left-to-right" | "right-to-left" | "top-to-bottom";
};

export function BeforeAfter({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  title = "",
  backgroundColor = "#0a0a0a",
  accentColor = "#22c55e",
  textColor = "#ffffff",
  revealDirection = "left-to-right",
}: BeforeAfterProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Phase 1: Show "before" fully (0 - 1.5s)
  // Phase 2: Slide reveal (1.5s - 3.5s)
  // Phase 3: Hold "after" (3.5s - end)

  const revealStart = Math.round(1.5 * fps);
  const revealDuration = Math.round(2 * fps);

  const revealProgress = interpolate(
    frame,
    [revealStart, revealStart + revealDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Smooth easing via spring
  const revealSpring = spring({
    frame: frame - revealStart,
    fps,
    config: { damping: 200 },
    durationInFrames: revealDuration,
  });

  const revealPercent = revealSpring * 100;

  // Clip paths based on direction
  const getAfterClip = () => {
    switch (revealDirection) {
      case "left-to-right":
        return `inset(0 ${100 - revealPercent}% 0 0)`;
      case "right-to-left":
        return `inset(0 0 0 ${100 - revealPercent}%)`;
      case "top-to-bottom":
        return `inset(0 0 ${100 - revealPercent}% 0)`;
    }
  };

  // Divider line position
  const getDividerStyle = (): React.CSSProperties => {
    switch (revealDirection) {
      case "left-to-right":
        return {
          left: `${revealPercent}%`,
          top: 0,
          bottom: 0,
          width: 4,
        };
      case "right-to-left":
        return {
          right: `${revealPercent}%`,
          top: 0,
          bottom: 0,
          width: 4,
        };
      case "top-to-bottom":
        return {
          top: `${revealPercent}%`,
          left: 0,
          right: 0,
          height: 4,
        };
    }
  };

  // Before label fade out
  const beforeLabelOpacity = interpolate(
    frame,
    [revealStart, revealStart + Math.round(0.5 * fps)],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // After label fade in
  const afterLabelOpacity = interpolate(
    frame,
    [revealStart + revealDuration - Math.round(0.5 * fps), revealStart + revealDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Before image entrance
  const beforeEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  };

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Before image */}
      <AbsoluteFill
        style={{
          opacity: interpolate(beforeEntrance, [0, 1], [0, 1]),
        }}
      >
        <Img src={beforeImage} style={imageStyle} />
      </AbsoluteFill>

      {/* After image with clip reveal */}
      <AbsoluteFill
        style={{
          clipPath: getAfterClip(),
        }}
      >
        <Img src={afterImage} style={imageStyle} />
      </AbsoluteFill>

      {/* Divider line */}
      {revealPercent > 0 && revealPercent < 100 && (
        <div
          style={{
            position: "absolute",
            ...getDividerStyle(),
            backgroundColor: textColor,
            zIndex: 10,
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
          }}
        />
      )}

      {/* Before label */}
      <Sequence from={Math.round(0.3 * fps)} premountFor={fps}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            padding: 40,
            opacity: beforeLabelOpacity,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.7)",
              color: textColor,
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: Math.round(width * 0.02),
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {beforeLabel}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* After label */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-end",
          padding: 40,
          opacity: afterLabelOpacity,
        }}
      >
        <div
          style={{
            backgroundColor: accentColor,
            color: textColor,
            padding: "10px 24px",
            borderRadius: 8,
            fontSize: Math.round(width * 0.02),
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {afterLabel}
        </div>
      </AbsoluteFill>

      {/* Title at bottom */}
      {title && (
        <Sequence from={Math.round(3.5 * fps)} premountFor={fps}>
          <AbsoluteFill
            style={{
              justifyContent: "flex-end",
              alignItems: "center",
              paddingBottom: height * 0.08,
            }}
          >
            <AnimatedTitle
              text={title}
              style="fade-up"
              fontSize={Math.round(width * 0.035)}
              color={textColor}
              durationFrames={Math.round(0.6 * fps)}
            />
          </AbsoluteFill>
        </Sequence>
      )}
    </AbsoluteFill>
  );
}
