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

type ProductShowcaseProps = {
  productImage: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
  durationInSeconds?: number;
};

export function ProductShowcase({
  productImage,
  title,
  subtitle = "",
  ctaText = "Shop Now",
  backgroundColor = "#0a0a0a",
  accentColor = "#6366f1",
  textColor = "#ffffff",
  durationInSeconds = 6,
}: ProductShowcaseProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // --- Image zoom animation ---
  const zoomProgress = interpolate(
    frame,
    [0, durationInSeconds * fps],
    [1, 1.15],
    { extrapolateRight: "clamp" }
  );

  const imageEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const imageOpacity = interpolate(imageEntrance, [0, 1], [0, 1]);
  const imageScale = interpolate(imageEntrance, [0, 1], [0.8, 1]) * zoomProgress;

  // --- CTA badge animation ---
  const ctaDelay = Math.round(2.5 * fps);
  const ctaSpring = spring({
    frame: frame - ctaDelay,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const ctaScale = interpolate(ctaSpring, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // --- Vignette ---
  const vignetteOpacity = interpolate(frame, [0, fps], [0, 0.6], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Product image with zoom */}
      <Sequence from={0} premountFor={fps}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: imageOpacity,
          }}
        >
          <Img
            src={productImage}
            style={{
              width: width * 0.7,
              height: height * 0.7,
              objectFit: "contain",
              transform: `scale(${imageScale})`,
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Radial vignette overlay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, ${backgroundColor} 100%)`,
          opacity: vignetteOpacity,
        }}
      />

      {/* Title */}
      <Sequence from={Math.round(0.8 * fps)} premountFor={fps}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: height * 0.22,
          }}
        >
          <AnimatedTitle
            text={title}
            style="fade-up"
            fontSize={Math.round(width * 0.045)}
            color={textColor}
            durationFrames={Math.round(0.8 * fps)}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Subtitle */}
      {subtitle && (
        <Sequence from={Math.round(1.4 * fps)} premountFor={fps}>
          <AbsoluteFill
            style={{
              justifyContent: "flex-end",
              alignItems: "center",
              paddingBottom: height * 0.15,
            }}
          >
            <AnimatedTitle
              text={subtitle}
              style="fade-up"
              fontSize={Math.round(width * 0.022)}
              color={`${textColor}cc`}
              durationFrames={Math.round(0.6 * fps)}
            />
          </AbsoluteFill>
        </Sequence>
      )}

      {/* CTA Badge */}
      <Sequence from={ctaDelay} premountFor={fps}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: height * 0.06,
          }}
        >
          <div
            style={{
              backgroundColor: accentColor,
              color: textColor,
              padding: "16px 48px",
              borderRadius: 60,
              fontSize: Math.round(width * 0.02),
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              transform: `scale(${ctaScale})`,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {ctaText}
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}
