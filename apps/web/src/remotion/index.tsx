import { Composition, Folder } from "remotion";
import {
  ProductShowcase,
  SocialReel,
  Testimonial,
  BeforeAfter,
  Slideshow,
  TextPromo,
} from "./templates";

const FPS = 30;

// --- Default props ---

const defaultProductShowcaseProps = {
  productImage: "https://placehold.co/800x800/1a1a2e/ffffff?text=Product",
  title: "Premium Headphones",
  subtitle: "Immersive sound. Unmatched comfort.",
  ctaText: "Shop Now",
  backgroundColor: "#0a0a0a",
  accentColor: "#6366f1",
  textColor: "#ffffff",
  durationInSeconds: 6,
};

const defaultSocialReelProps = {
  slides: [
    { image: "https://placehold.co/1080x1920/1a1a2e/ffffff?text=Slide+1", durationInSeconds: 3 },
    { image: "https://placehold.co/1080x1920/2e1a2e/ffffff?text=Slide+2", durationInSeconds: 3 },
    { image: "https://placehold.co/1080x1920/1a2e2e/ffffff?text=Slide+3", durationInSeconds: 3 },
  ],
  headline: "Check This Out",
  captions: [],
  captionStyle: "tiktok-bold" as const,
  accentColor: "#FFD700",
  overlayColor: "rgba(0,0,0,0.3)",
};

const defaultTestimonialProps = {
  quote: "This product completely changed the way we work. The results speak for themselves.",
  authorName: "Maria Garcia",
  authorRole: "CEO, TechCorp",
  avatarUrl: "https://placehold.co/200x200/6366f1/ffffff?text=MG",
  brandName: "ArbiStudio",
  backgroundColor: "#0f172a",
  accentColor: "#6366f1",
  textColor: "#ffffff",
  starRating: 5,
};

const defaultBeforeAfterProps = {
  beforeImage: "https://placehold.co/1920x1080/374151/ffffff?text=Before",
  afterImage: "https://placehold.co/1920x1080/22c55e/ffffff?text=After",
  beforeLabel: "Before",
  afterLabel: "After",
  title: "See The Difference",
  backgroundColor: "#0a0a0a",
  accentColor: "#22c55e",
  textColor: "#ffffff",
  revealDirection: "left-to-right" as const,
};

const defaultSlideshowProps = {
  slides: [
    { image: "https://placehold.co/1920x1080/1e293b/ffffff?text=Photo+1", caption: "Beautiful landscapes" },
    { image: "https://placehold.co/1920x1080/334155/ffffff?text=Photo+2", caption: "Urban architecture" },
    { image: "https://placehold.co/1920x1080/1e3a5f/ffffff?text=Photo+3", caption: "Natural wonders" },
    { image: "https://placehold.co/1920x1080/3b1e5f/ffffff?text=Photo+4", caption: "Sunset views" },
  ],
  secondsPerSlide: 3,
  transitionDurationFrames: 15,
  backgroundColor: "#000000",
  textColor: "#ffffff",
  showCaptions: true,
  title: "Photo Collection",
};

const defaultTextPromoProps = {
  lines: [
    { text: "Introducing", style: "fade-up" as const, delayInSeconds: 0 },
    { text: "The Future of", style: "slide-left" as const, delayInSeconds: 0.5 },
    { text: "Content Creation", style: "scale" as const, fontSize: 90, delayInSeconds: 1.2 },
    { text: "Powered by AI", style: "blur-in" as const, delayInSeconds: 2.0 },
  ],
  backgroundColor: "#0a0a0a",
  accentColor: "#6366f1",
  textColor: "#ffffff",
  backgroundPattern: "gradient-mesh" as const,
};

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Templates">
        {/* Landscape templates (1920x1080) */}
        <Folder name="Landscape">
          <Composition
            id="ProductShowcase"
            component={ProductShowcase}
            durationInFrames={6 * FPS}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={defaultProductShowcaseProps}
          />

          <Composition
            id="Testimonial"
            component={Testimonial}
            durationInFrames={6 * FPS}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={defaultTestimonialProps}
          />

          <Composition
            id="BeforeAfter"
            component={BeforeAfter}
            durationInFrames={6 * FPS}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={defaultBeforeAfterProps}
          />

          <Composition
            id="Slideshow"
            component={Slideshow}
            durationInFrames={defaultSlideshowProps.slides.length * defaultSlideshowProps.secondsPerSlide * FPS}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={defaultSlideshowProps}
          />

          <Composition
            id="TextPromo"
            component={TextPromo}
            durationInFrames={5 * FPS}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={defaultTextPromoProps}
          />
        </Folder>

        {/* Vertical templates (1080x1920) */}
        <Folder name="Vertical">
          <Composition
            id="SocialReel"
            component={SocialReel}
            durationInFrames={9 * FPS}
            fps={FPS}
            width={1080}
            height={1920}
            defaultProps={defaultSocialReelProps}
          />

          <Composition
            id="ProductShowcaseVertical"
            component={ProductShowcase}
            durationInFrames={6 * FPS}
            fps={FPS}
            width={1080}
            height={1920}
            defaultProps={defaultProductShowcaseProps}
          />

          <Composition
            id="TestimonialVertical"
            component={Testimonial}
            durationInFrames={6 * FPS}
            fps={FPS}
            width={1080}
            height={1920}
            defaultProps={defaultTestimonialProps}
          />

          <Composition
            id="TextPromoVertical"
            component={TextPromo}
            durationInFrames={5 * FPS}
            fps={FPS}
            width={1080}
            height={1920}
            defaultProps={defaultTextPromoProps}
          />
        </Folder>
      </Folder>
    </>
  );
};
