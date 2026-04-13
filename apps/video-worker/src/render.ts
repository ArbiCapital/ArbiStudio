import path from "path";
import {
  bundle,
  renderMedia,
  selectComposition,
} from "@remotion/renderer";

type RenderConfig = {
  compositionId: string;
  inputProps?: Record<string, unknown>;
  outputPath?: string;
  codec?: "h264" | "h265" | "vp8" | "vp9";
  crf?: number;
  concurrency?: number;
};

const REMOTION_ENTRY = path.resolve(
  __dirname,
  "../../web/src/remotion/index.tsx"
);

export async function renderVideo({
  compositionId,
  inputProps = {},
  outputPath,
  codec = "h264",
  crf = 18,
  concurrency,
}: RenderConfig): Promise<string> {
  const outFile =
    outputPath ??
    path.resolve(__dirname, `../output/${compositionId}-${Date.now()}.mp4`);

  console.log(`[video-worker] Bundling remotion entry...`);

  const bundled = await bundle({
    entryPoint: REMOTION_ENTRY,
    onProgress: (progress) => {
      if (progress % 25 === 0) {
        console.log(`[video-worker] Bundle progress: ${progress}%`);
      }
    },
  });

  console.log(`[video-worker] Selecting composition: ${compositionId}`);

  const composition = await selectComposition({
    serveUrl: bundled,
    id: compositionId,
    inputProps,
  });

  console.log(
    `[video-worker] Rendering ${composition.width}x${composition.height} @ ${composition.fps}fps, ${composition.durationInFrames} frames`
  );

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec,
    outputLocation: outFile,
    inputProps,
    crf,
    concurrency: concurrency ?? undefined,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (pct % 10 === 0) {
        console.log(`[video-worker] Render progress: ${pct}%`);
      }
    },
  });

  console.log(`[video-worker] Done! Output: ${outFile}`);
  return outFile;
}
