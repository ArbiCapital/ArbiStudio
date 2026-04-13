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
import { CaptionOverlay } from "../components/caption-overlay";

type CaptionWord = {
  text: string;
  start: number;
  end: number;
};

type SlideItem = {
  image: string;
  durationInSeconds: number;
};

type SocialReelProps = {
  slides: SlideItem[];
  headline?: string;
  captions?: CaptionWord[];
  captionStyle?: "tiktok-bold" | "minimal" | "outline" | "gradient" | "karaoke";
  accentColor?: string;
  overlayColor?: string;
};

export function SocialReel({
  slides,
  headline = "",
  captions = [],
  captionStyle = "tiktok-bold",
  accentColor = "#FFD700",
  overlayColor = "rgba(0,0,0,0.3)",
}: SocialReelProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Calculate frame offsets for each slide
  const slideFrames = slides.map((s) => Math.round(s.durationInSeconds * fps));
  const slideStarts: number[] = [];
  let cumulative = 0;
  for (const sf of slideFrames) {
    slideStarts.push(cumulative);
    cumulative += sf;
  }

  // Ken Burns effect for each slide
  const renderSlide = (slide: SlideItem, index: number) => {
    const start = slideStarts[index];
    const duration = slideFrames[index];
    const localFrame = frame - start;

    if (localFrame < 0 || localFrame >= duration) return null;

    // Alternate zoom direction per slide
    const isEven = index % 2 === 0;
    const scale = interpolate(localFrame, [0, duration], isEven ? [1, 1.15] : [1.15, 1], {
      extrapolateRight: "clamp",
    });
    const translateX = interpolate(
      localFrame,
      [0, duration],
      isEven ? [0, -20] : [-20, 0],
      { extrapolateRight: "clamp" }
    );

    // Fade in/out at edges
    const fadeIn = interpolate(localFrame, [0, Math.round(fps * 0.4)], [0, 1], {
      extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(
      localFrame,
      [duration - Math.round(fps * 0.4), duration],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const opacity = Math.min(fadeIn, fadeOut);

    return (
      <AbsoluteFill key={index} style={{ opacity }}>
        <Img
          src={slide.image}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateX(${translateX}px)`,
          }}
        />
      </AbsoluteFill>
    );
  };

  // Find active slide index
  let activeSlideIndex = 0;
  for (let i = 0; i < slides.length; i++) {
    if (frame >= slideStarts[i]) activeSlideIndex = i;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Background slides with ken burns */}
      {slides.map((slide, i) => renderSlide(slide, i))}

      {/* Dark overlay for text readability */}
      <AbsoluteFill style={{ backgroundColor: overlayColor }} />

      {/* Headline at top */}
      {headline && (
        <Sequence from={0} durationInFrames={Math.round(2 * fps)} premountFor={fps}>
          <AbsoluteFill
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              paddingTop: height * 0.12,
            }}
          >
            <AnimatedTitle
              text={headline}
              style="scale"
              fontSize={Math.round(width * 0.07)}
              color="#ffffff"
              durationFrames={Math.round(0.6 * fps)}
            />
          </AbsoluteFill>
        </Sequence>
      )}

      {/* Captions */}
      {captions.length > 0 && (
        <CaptionOverlay
          words={captions}
          style={captionStyle}
          fontSize={Math.round(width * 0.055)}
          highlightColor={accentColor}
          position="bottom"
        />
      )}

      {/* Progress dots */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 24,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {slides.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === activeSlideIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === activeSlideIndex ? accentColor : "rgba(255,255,255,0.4)",
                transition: "none",
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
