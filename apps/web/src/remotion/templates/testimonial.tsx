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

type TestimonialProps = {
  quote: string;
  authorName: string;
  authorRole?: string;
  avatarUrl?: string;
  brandName?: string;
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
  starRating?: number;
};

export function Testimonial({
  quote,
  authorName,
  authorRole = "",
  avatarUrl,
  brandName = "",
  backgroundColor = "#0f172a",
  accentColor = "#6366f1",
  textColor = "#ffffff",
  starRating = 5,
}: TestimonialProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // --- Quote marks entrance ---
  const quoteMarkSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const quoteMarkScale = interpolate(quoteMarkSpring, [0, 1], [0.5, 1]);
  const quoteMarkOpacity = interpolate(quoteMarkSpring, [0, 1], [0, 0.15]);

  // --- Stars animation ---
  const starsDelay = Math.round(0.5 * fps);
  const starsEntrance = spring({
    frame: frame - starsDelay,
    fps,
    config: { damping: 15, stiffness: 200 },
  });

  // --- Avatar entrance ---
  const avatarDelay = Math.round(2.5 * fps);
  const avatarSpring = spring({
    frame: frame - avatarDelay,
    fps,
    config: { damping: 200 },
  });
  const avatarScale = interpolate(avatarSpring, [0, 1], [0.6, 1]);
  const avatarOpacity = interpolate(avatarSpring, [0, 1], [0, 1]);

  // --- Author name entrance ---
  const authorDelay = Math.round(3 * fps);
  const authorSpring = spring({
    frame: frame - authorDelay,
    fps,
    config: { damping: 200 },
  });
  const authorTranslateY = interpolate(authorSpring, [0, 1], [20, 0]);
  const authorOpacity = interpolate(authorSpring, [0, 1], [0, 1]);

  // --- Accent line ---
  const lineWidth = interpolate(frame, [0, Math.round(1.5 * fps)], [0, 80], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        padding: width * 0.08,
      }}
    >
      {/* Large decorative quotation mark */}
      <div
        style={{
          position: "absolute",
          top: height * 0.1,
          left: width * 0.08,
          fontSize: width * 0.3,
          fontFamily: "Georgia, serif",
          color: accentColor,
          opacity: quoteMarkOpacity,
          transform: `scale(${quoteMarkScale})`,
          lineHeight: 1,
        }}
      >
        {"\u201C"}
      </div>

      {/* Stars */}
      <Sequence from={starsDelay} premountFor={fps}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: height * 0.25,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: 5 }).map((_, i) => {
              const starDelay = i * 3;
              const starSpring = spring({
                frame: frame - starsDelay - starDelay,
                fps,
                config: { damping: 12, stiffness: 200 },
              });
              const starScale = interpolate(starSpring, [0, 1], [0, 1], {
                extrapolateRight: "clamp",
              });

              return (
                <div
                  key={i}
                  style={{
                    fontSize: Math.round(width * 0.03),
                    transform: `scale(${starScale})`,
                    color: i < starRating ? "#facc15" : "#374151",
                  }}
                >
                  {"\u2605"}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Quote text */}
      <Sequence from={Math.round(1 * fps)} premountFor={fps}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: `0 ${width * 0.12}px`,
          }}
        >
          <AnimatedTitle
            text={`"${quote}"`}
            style="fade-up"
            fontSize={Math.round(width * 0.032)}
            color={textColor}
            durationFrames={Math.round(fps)}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Accent divider line */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: height * 0.22,
        }}
      >
        <div
          style={{
            width: lineWidth,
            height: 3,
            backgroundColor: accentColor,
            borderRadius: 2,
          }}
        />
      </AbsoluteFill>

      {/* Avatar + Author info */}
      <Sequence from={avatarDelay} premountFor={fps}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: height * 0.08,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            {avatarUrl && (
              <Img
                src={avatarUrl}
                style={{
                  width: Math.round(width * 0.06),
                  height: Math.round(width * 0.06),
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `3px solid ${accentColor}`,
                  transform: `scale(${avatarScale})`,
                  opacity: avatarOpacity,
                }}
              />
            )}

            <div
              style={{
                opacity: authorOpacity,
                transform: `translateY(${authorTranslateY}px)`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(width * 0.022),
                  fontWeight: 700,
                  color: textColor,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {authorName}
              </div>
              {authorRole && (
                <div
                  style={{
                    fontSize: Math.round(width * 0.016),
                    color: `${textColor}99`,
                    fontFamily: "Inter, sans-serif",
                    marginTop: 4,
                  }}
                >
                  {authorRole}
                </div>
              )}
            </div>

            {brandName && (
              <div
                style={{
                  fontSize: Math.round(width * 0.014),
                  color: accentColor,
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  opacity: authorOpacity,
                  marginTop: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {brandName}
              </div>
            )}
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}
