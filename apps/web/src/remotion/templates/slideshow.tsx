import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedTitle } from "../components/animated-title";

type SlideItem = {
  image: string;
  caption?: string;
};

type SlideshowProps = {
  slides: SlideItem[];
  secondsPerSlide?: number;
  transitionDurationFrames?: number;
  backgroundColor?: string;
  textColor?: string;
  showCaptions?: boolean;
  title?: string;
};

export function Slideshow({
  slides,
  secondsPerSlide = 3,
  transitionDurationFrames = 15,
  backgroundColor = "#000000",
  textColor = "#ffffff",
  showCaptions = true,
  title = "",
}: SlideshowProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const framesPerSlide = Math.round(secondsPerSlide * fps);

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Title overlay at the beginning */}
      {title && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            zIndex: 20,
            opacity: interpolate(
              frame,
              [0, Math.round(0.5 * fps), Math.round(2 * fps), Math.round(2.5 * fps)],
              [0, 1, 1, 0],
              { extrapolateRight: "clamp" }
            ),
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          />
          <div style={{ zIndex: 1 }}>
            <AnimatedTitle
              text={title}
              style="scale"
              fontSize={Math.round(width * 0.05)}
              color={textColor}
              durationFrames={Math.round(0.8 * fps)}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Slides */}
      {slides.map((slide, index) => {
        const slideStart = index * framesPerSlide;
        const slideEnd = slideStart + framesPerSlide;

        // Fade in
        const fadeIn = interpolate(
          frame,
          [slideStart, slideStart + transitionDurationFrames],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Fade out
        const fadeOut = interpolate(
          frame,
          [slideEnd - transitionDurationFrames, slideEnd],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Don't fade out the last slide
        const opacity = index === slides.length - 1 ? fadeIn : Math.min(fadeIn, fadeOut);

        // Subtle ken burns
        const localFrame = frame - slideStart;
        const scale = interpolate(
          localFrame,
          [0, framesPerSlide],
          [1, 1.08],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Only render if within range (with buffer for transitions)
        if (
          frame < slideStart - transitionDurationFrames ||
          frame > slideEnd + transitionDurationFrames
        ) {
          return null;
        }

        return (
          <AbsoluteFill key={index} style={{ opacity }}>
            <Img
              src={slide.image}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${scale})`,
              }}
            />

            {/* Caption bar */}
            {showCaptions && slide.caption && (
              <AbsoluteFill
                style={{
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingBottom: height * 0.06,
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(10px)",
                    color: textColor,
                    padding: "12px 32px",
                    borderRadius: 12,
                    fontSize: Math.round(width * 0.02),
                    fontWeight: 500,
                    fontFamily: "Inter, sans-serif",
                    maxWidth: "70%",
                    textAlign: "center",
                    opacity: interpolate(
                      localFrame,
                      [Math.round(0.3 * fps), Math.round(0.6 * fps)],
                      [0, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    ),
                    transform: `translateY(${interpolate(
                      localFrame,
                      [Math.round(0.3 * fps), Math.round(0.6 * fps)],
                      [20, 0],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    )}px)`,
                  }}
                >
                  {slide.caption}
                </div>
              </AbsoluteFill>
            )}
          </AbsoluteFill>
        );
      })}

      {/* Slide counter */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-end",
          padding: 24,
          zIndex: 15,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            color: textColor,
            padding: "6px 14px",
            borderRadius: 20,
            fontSize: Math.round(width * 0.014),
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
          }}
        >
          {Math.min(Math.floor(frame / framesPerSlide) + 1, slides.length)} / {slides.length}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
