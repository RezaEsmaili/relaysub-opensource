import type { Metadata } from "next";
import { RelaySubClient } from "./RelaySubClient";
import { RelaySubDemoVideo } from "./RelaySubDemoVideo";
import { SoftwareApplicationJsonLd } from "@/components/JsonLd";
import { RELAYSUB_ROUND_ICON } from "@/lib/relaysub-assets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "RelaySub — Subtitle Translator (SRT, VTT, ASS)",
  },
  applicationName: "RelaySub",
  description:
    "Translate .srt, .vtt, and .ass subtitle files online with RelaySub into 100+ languages. Upload subtitles, edit translated lines, and export a clean translated file directly in your browser.",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    title: "RelaySub",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: RELAYSUB_ROUND_ICON, sizes: "512x512", type: "image/png" },
      { url: RELAYSUB_ROUND_ICON, sizes: "192x192", type: "image/png" },
    ],
    shortcut: [{ url: RELAYSUB_ROUND_ICON, type: "image/png" }],
    apple: [{ url: RELAYSUB_ROUND_ICON, sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "RelaySub",
    description:
      "Upload .srt, .vtt, or .ass subtitles, translate into 100+ languages line by line, manually edit the result, and download a clean translated subtitle file.",
    url: "https://relaysub.example.com",
    siteName: "RelaySub",
    type: "website",
    images: [RELAYSUB_ROUND_ICON],
  },
  twitter: {
    card: "summary",
    title: "RelaySub",
    description:
      "Upload .srt, .vtt, or .ass subtitles, translate into 100+ languages line by line, manually edit the result, and download a clean translated subtitle file.",
    images: [RELAYSUB_ROUND_ICON],
  },
};

const FALLBACK_FAQ: { question: string; answer: string }[] = [
  { question: "What is RelaySub?", answer: "RelaySub is a free online subtitle translator. You upload an .srt, .vtt, or .ass subtitle file, translate every line into the language you choose, edit the results, and download a clean translated file — all in your browser, with nothing to install." },
  { question: "How do I translate an SRT subtitle file?", answer: "Upload your .srt, .vtt, or .ass file or drag and drop it, choose a target language, and press Translate. RelaySub translates the subtitles in fast batches, then lets you edit any line before you export the finished file." },
  { question: "Is RelaySub free to use?", answer: "Yes. RelaySub is completely free for translating, editing, and exporting subtitle files online. There is no sign-up and no software to download." },
  { question: "Will the subtitle timings change after translation?", answer: "No. RelaySub only translates the subtitle text. Every subtitle number and start and end timestamp is preserved, so your translated subtitles stay perfectly in sync with the video." },
  { question: "Which subtitle formats and languages are supported?", answer: "RelaySub works with .srt, .vtt (WebVTT), and .ass / .ssa subtitle files, and exports back to the same format. It supports more than 100 target languages, including right-to-left languages such as Arabic, Persian, and Hebrew." },
  { question: "Are my subtitle files private?", answer: "Your subtitles are used only to produce the translation and are not stored or shared. RelaySub is a lightweight, browser-based tool focused on doing one job well." },
];

export default function RelaySubPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FALLBACK_FAQ.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };

  return (
    <>
      <SoftwareApplicationJsonLd
        name="RelaySub"
        description="Translate .srt, .vtt, and .ass subtitle files online with RelaySub into 100+ languages. Upload subtitles, edit translated lines, and export a clean translated file directly in your browser."
        path="/"
        operatingSystem="Web"
        category="MultimediaApplication"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <RelaySubClient />
      <RelaySubDemoVideo />
    </>
  );
}
