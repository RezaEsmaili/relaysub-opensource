import { RELAYSUB_ROUND_ICON } from "@/lib/relaysub-assets";

export default function Head() {
  return (
    <>
      <link rel="apple-touch-icon" sizes="180x180" href={RELAYSUB_ROUND_ICON} />
      <link rel="icon" type="image/png" sizes="192x192" href={RELAYSUB_ROUND_ICON} />
      <link rel="icon" type="image/png" sizes="512x512" href={RELAYSUB_ROUND_ICON} />
      <link rel="manifest" href="/relaysub/manifest.webmanifest" />
      <meta name="apple-mobile-web-app-title" content="RelaySub" />
      <meta name="application-name" content="RelaySub" />
      <meta name="theme-color" content="#007AFF" />
    </>
  );
}
