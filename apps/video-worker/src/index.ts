import { renderVideo } from "./render";

async function main() {
  const compositionId = process.argv[2];
  const propsArg = process.argv[3];

  if (!compositionId) {
    console.log("Usage: tsx src/index.ts <compositionId> [propsJson]");
    console.log("");
    console.log("Available compositions:");
    console.log("  ProductShowcase          - Product ad (1920x1080)");
    console.log("  SocialReel               - Vertical reel (1080x1920)");
    console.log("  Testimonial              - Customer testimonial (1920x1080)");
    console.log("  BeforeAfter              - Split comparison (1920x1080)");
    console.log("  Slideshow                - Multi-image slideshow (1920x1080)");
    console.log("  TextPromo                - Kinetic typography (1920x1080)");
    console.log("  ProductShowcaseVertical  - Product ad vertical (1080x1920)");
    console.log("  TestimonialVertical      - Testimonial vertical (1080x1920)");
    console.log("  TextPromoVertical        - Kinetic typography vertical (1080x1920)");
    console.log("");
    console.log("Example:");
    console.log(
      '  tsx src/index.ts ProductShowcase \'{"title":"My Product","ctaText":"Buy Now"}\''
    );
    process.exit(1);
  }

  let inputProps: Record<string, unknown> = {};
  if (propsArg) {
    try {
      inputProps = JSON.parse(propsArg);
    } catch {
      console.error("Error: Invalid JSON for props argument");
      process.exit(1);
    }
  }

  try {
    const outputPath = await renderVideo({
      compositionId,
      inputProps,
    });
    console.log(`\nVideo rendered successfully: ${outputPath}`);
  } catch (error) {
    console.error("Render failed:", error);
    process.exit(1);
  }
}

main();
