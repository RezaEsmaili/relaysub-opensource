import type { MetadataRoute } from "next";
import { RELAYSUB_ROUND_ICON } from "@/lib/relaysub-assets";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RelaySub",
    short_name: "RelaySub",
    description: "Free SRT Subtitle Translator Online by R22E",
    start_url: "/relaysub",
    scope: "/relaysub",
    display: "standalone",
    background_color: "#f5f8ff",
    theme_color: "#007AFF",
    orientation: "portrait-primary",
    categories: ["utilities", "productivity", "education"],
    icons: [
      {
        src: RELAYSUB_ROUND_ICON,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: RELAYSUB_ROUND_ICON,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
