"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Clock3, CreditCard, FileText, Lock, Smartphone, Sparkles, Star, Upload, Zap } from "lucide-react";
import Link from "next/link";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import { FAQAccordion } from "@/components/FAQAccordion";
import { LANGUAGES } from "./languages";
import { LanguagesShowcase } from "./LanguagesShowcase";
import { RELAYSUB_SQUARE_ICON } from "@/lib/relaysub-assets";

type SubtitleCue = {
  id: number;
  start: string;
  end: string;
  originalText: string;
  translatedText: string;
  status: "idle" | "translating" | "done" | "error";
};

type EditableItem = { title?: string; description?: string };
type SubtitleFormat = "srt" | "vtt" | "ass";
type TranslatorEngine = "google" | "ai";
type RelaySubHistoryItem = { id: string; fileName: string; language: string; lineCount: number; createdAt: string };

const RELAYSUB_URL = "https://r22e.com/relaysub";
const RELAYSUB_TRANSLATOR_URL = "/relaysub#translator";
const RELAYSUB_BLUE = "#007AFF";
const RELAYSUB_HISTORY_KEY = "relaysubRecentSubtitles";
const RTL_LANGUAGE_CODES = new Set(["ar", "fa", "he", "iw", "ur", "ps", "sd", "ug", "yi", "ku", "dv"]);
const RTL_CHARACTER_REGEX = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
const LTR_CHARACTER_REGEX = /[A-Za-z\u00C0-\u024F\u0400-\u052F]/;

const fallbackFeatures: EditableItem[] = [
  { title: "Translate subtitles in seconds", description: "RelaySub is a free online subtitle translator that converts your .srt, .vtt, or .ass / .ssa file into the language you choose in fast batches — no waiting line by line." },
  { title: "Timings stay perfectly in sync", description: "Only the subtitle text is translated. Every subtitle number and timestamp is preserved, so your translated file stays in sync with the video." },
  { title: "Works right in your browser", description: "Upload, translate, edit each line, and export — all online with nothing to install. RelaySub runs entirely in your browser, for free." },
];

const fallbackFaq: EditableItem[] = [
  { title: "What is RelaySub?", description: "RelaySub is a free online subtitle translator from R22E. You upload an .srt, .vtt, or .ass subtitle file, translate every line into the language you choose, edit the results, and download a clean translated file — all in your browser, with nothing to install." },
  { title: "How do I translate an SRT subtitle file?", description: "Upload your .srt, .vtt, or .ass file or drag and drop it, choose a target language, and press Translate. RelaySub translates the subtitles in fast batches, then lets you edit any line before you export the finished file." },
  { title: "Is RelaySub free to use?", description: "Yes. RelaySub is completely free for translating, editing, and exporting subtitle files online. There is no sign-up and no software to download." },
  { title: "Will the subtitle timings change after translation?", description: "No. RelaySub only translates the subtitle text. Every subtitle number and start and end timestamp is preserved, so your translated subtitles stay perfectly in sync with the video." },
  { title: "Which subtitle formats and languages are supported?", description: "RelaySub works with .srt, .vtt (WebVTT), and .ass / .ssa subtitle files, and exports back to the same format. It supports more than 100 target languages, including right-to-left languages such as Arabic, Persian, and Hebrew." },
  { title: "Are my subtitle files private?", description: "Your subtitles are used only to produce the translation and are not stored or shared. RelaySub is a lightweight, browser-based tool focused on doing one job well." },
];

// ── Testimonials ─────────────────────────────────────────────────────────────
// Replace `name`, `handle`, and `quote` with real user feedback when you have
// it (keep 3–6 entries for a balanced grid). `initials` shows in the avatar
// circle, `color` is its background, and `rtl: true` right-aligns the quote for
// right-to-left languages (Persian, Arabic).
type Testimonial = { name: string; handle: string; initials: string; color: string; quote: string; rtl?: boolean };
const relaySubTestimonials: Testimonial[] = [
  { name: "प्रिया शर्मा", handle: "वीडियो एडिटर", initials: "प", color: "#007AFF", quote: "मैंने एक लंबी SRT फ़ाइल अपलोड की और कुछ ही सेकंड में पूरा अनुवाद तैयार हो गया। सबसे अच्छी बात यह रही कि टाइमिंग बिल्कुल वैसी ही रही, मुझे कुछ भी ठीक नहीं करना पड़ा।" },
  { name: "李伟", handle: "内容创作者", initials: "李", color: "#34C759", quote: "我每周都要给视频加字幕，以前真的很费时间。RelaySub 直接在浏览器里就能翻译，速度很快，导出的文件也很干净，省了我不少功夫。" },
  { name: "佐藤美咲", handle: "翻訳者", initials: "佐", color: "#FF9500", quote: "書き出す前に翻訳された一行ずつを自分で直せるのが本当に助かります。タイムコードがずれないので、安心して仕事に使えています。" },
  { name: "سارا احمدی", handle: "دانشجوی سینما", initials: "س", color: "#AF52DE", quote: "خیلی ساده و سریع است. فایل را می‌اندازی، زبان را انتخاب می‌کنی و چند ثانیه بعد ترجمه آماده است. دیگر لازم نیست هیچ برنامه‌ای روی سیستم نصب کنم.", rtl: true },
  { name: "Michael Carter", handle: "YouTube Creator", initials: "MC", color: "#FF2D55", quote: "I've tried a bunch of subtitle tools over the years and this is the one I keep coming back to. It just works, and the file it gives me is always ready to upload." },
  { name: "أحمد حسن", handle: "محرر فيديو", initials: "أ", color: "#5856D6", quote: "أرفع ملف الترجمة وأختار اللغة، وخلال ثوانٍ يصبح كل شيء جاهزًا. التوقيت لا يتغير أبدًا، والملف الناتج نظيف تمامًا وجاهز للاستخدام مباشرة.", rtl: true },
];

export function RelaySubClient() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cues, setCues] = useState<SubtitleCue[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("No file uploaded yet");
  const [downloadName, setDownloadName] = useState("translated_subtitles.srt");
  const [uploadError, setUploadError] = useState("");
  const [progress, setProgress] = useState(0);
  const [shared, setShared] = useState(false);
  const [fileFormat, setFileFormat] = useState<SubtitleFormat>("srt");
  const [assTemplate, setAssTemplate] = useState("");
  const [history, setHistory] = useState<RelaySubHistoryItem[]>([]);
  
  

  const heroButtonUrl = RELAYSUB_TRANSLATOR_URL;
  const accentColor = RELAYSUB_BLUE;
  const featureItems = fallbackFeatures;
  const faqItems = fallbackFaq;
  const featuresTitle = "Fast, clean, and editable.";
  const faqTitle = "Common questions.";

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RELAYSUB_HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored).slice(0, 10));
    } catch {
      setHistory([]);
    }

  }, []);

  async function loadSrtFile(file: File) {
    const lowerName = file.name.toLowerCase();
    const format: SubtitleFormat | null = lowerName.endsWith(".srt")
      ? "srt"
      : lowerName.endsWith(".vtt")
      ? "vtt"
      : lowerName.endsWith(".ass") || lowerName.endsWith(".ssa")
      ? "ass"
      : null;
    if (!format) {
      setUploadError("Please upload a valid .srt, .vtt, or .ass subtitle file.");
      return;
    }

    const text = await file.text();
    let parsed: SubtitleCue[];
    let template = "";
    if (format === "ass") {
      const result = parseAss(text);
      parsed = result.cues;
      template = result.template;
    } else if (format === "vtt") {
      parsed = parseVtt(text);
    } else {
      parsed = parseSrt(text);
    }

    if (parsed.length === 0) {
      setUploadError("This file could not be parsed as a subtitle file.");
      return;
    }

    setCues(parsed);
    setFileFormat(format);
    setAssTemplate(template);
    setFileName(file.name);
    setDownloadName(`${file.name.replace(/\.(srt|vtt|ass|ssa)$/i, "")}_translated.${format}`);
    setProgress(0);
    setUploadError("");
  }

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) await loadSrtFile(file);
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) await loadSrtFile(file);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  async function translateAllRows() {
    if (cues.length === 0 || isTranslating || !selectedLanguage) return;


    setIsTranslating(true);
    setProgress(0);
    setCues((current) => current.map((cue) => ({ ...cue, status: "translating" })));

    try {
      const translated = await translateCuesFast(cues, selectedLanguage, (done, total) => setProgress(Math.round((done / total) * 100)));
      const successCount = translated.filter(Boolean).length;
      setCues((current) => current.map((cue, index) => ({
        ...cue,
        translatedText: translated[index] || cue.translatedText || cue.originalText,
        status: translated[index] ? "done" : "error",
      })));
      rememberHistory({
        fileName,
        language: LANGUAGES.find((language) => language.code === selectedLanguage)?.label ?? selectedLanguage,
        lineCount: cues.length,
      });
    } catch {
      setCues((current) => current.map((cue) => ({ ...cue, status: "error" })));
    } finally {
      setIsTranslating(false);
    }
  }

  function updateTranslatedText(index: number, value: string) {
    setCues((current) => current.map((cue, cueIndex) => (cueIndex === index ? { ...cue, translatedText: value } : cue)));
  }

  function downloadTranslatedSrt() {
    if (cues.length === 0) return;
    const content = fileFormat === "ass" ? exportAss(cues, assTemplate) : fileFormat === "vtt" ? exportVtt(cues) : exportSrt(cues);
    downloadTextFile(downloadName, content);
  }

  function rememberHistory(item: Omit<RelaySubHistoryItem, "id" | "createdAt">) {
    const next = [
      { ...item, id: `${Date.now()}`, createdAt: new Date().toISOString() },
      ...history.filter((entry) => entry.fileName !== item.fileName || entry.language !== item.language),
    ].slice(0, 10);
    setHistory(next);
    try {
      localStorage.setItem(RELAYSUB_HISTORY_KEY, JSON.stringify(next));
    } catch {
      // Local history is only a convenience; translation still works without storage.
    }
  }

  async function handleShare() {
    const shareData = { title: "RelaySub — SRT Subtitle Translator", text: "Translate SRT subtitles online with RelaySub.", url: RELAYSUB_URL };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(RELAYSUB_URL);
      setShared(true);
      setTimeout(() => setShared(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <div className="bg-blue-50 text-[#007AFF] text-center text-sm font-semibold py-3 px-4">
        Want to use the official managed version? Check out <a href="https://r22e.com/relaysub" target="_blank" rel="noreferrer" className="underline font-black">r22e.com/relaysub</a>
      </div>
      <section className="relative overflow-hidden bg-white px-4 pb-16 pt-28 text-center sm:px-6 sm:pt-36 lg:px-8 lg:pb-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[920px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${withAlpha(accentColor, 0.10)}, transparent 70%)` }} />
        <div className="relative mx-auto max-w-3xl">
          <AnimatedReveal>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400">RelaySub</span>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
              Translate subtitles in seconds.
            </h1>
          </AnimatedReveal>
        </div>

        <div className="relative mx-auto mt-10 max-w-3xl">
          <RelaySubDemoPreview />
        </div>

        <AnimatedReveal delay={0.1}>
          <p className="mx-auto mt-9 max-w-xl text-base font-medium leading-7 text-zinc-500 sm:text-lg">
The <span className="font-bold text-zinc-800">free online subtitle translator</span>. Drop in an <span className="font-semibold text-zinc-700">.srt</span>, <span className="font-semibold text-zinc-700">.vtt</span>, or <span className="font-semibold text-zinc-700">.ass</span> file, pick from <span className="font-semibold text-zinc-700">100+ languages</span>, then edit and export a clean, perfectly-timed translation — right in your browser.
          </p>
          <div className="mt-7 flex flex-nowrap items-center justify-center gap-2.5 sm:gap-3">
            <a href={heroButtonUrl} className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(0,122,255,0.28)] transition-opacity hover:opacity-90 sm:gap-2 sm:px-7 sm:py-3.5 sm:text-base" style={{ backgroundColor: accentColor }}>
              Try RelaySub <ArrowRight size={16} />
            </a>
            <a href="#features" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-50 sm:px-7 sm:py-3.5 sm:text-base">Features</a>
            <button type="button" onClick={handleShare} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-50 sm:px-7 sm:py-3.5 sm:text-base">
              {shared ? "Copied" : "Share"}
            </button>
          </div>
        </AnimatedReveal>
      </section>

      <section id="translator" className="bg-zinc-50/80 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mb-4 grid gap-3 lg:mb-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="hidden lg:block">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400">Translator tool</span>
              <h2 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                <span className="block text-[#007AFF]">RelaySub.</span>
                <span className="block text-zinc-500">Subtitle Translator + Editor.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-zinc-500 sm:text-lg">Drop your .srt, .vtt, or .ass file, choose from 100+ target languages, translate in fast batches, then fine-tune every line before export.</p>
            </div>
            <div className="flex w-full flex-col items-start gap-2 sm:w-fit sm:flex-row sm:items-center lg:justify-self-end">
              <div className="inline-flex h-10 max-w-full items-center rounded-full border border-zinc-200 bg-white px-3 text-[11px] font-semibold text-zinc-500 shadow-sm sm:h-11 sm:px-4 sm:text-xs">
                <p className="flex min-w-0 items-center gap-1.5"><span className="shrink-0 text-zinc-400">Active file</span><span className="text-zinc-300">•</span><span title={fileName} className="block max-w-[170px] truncate text-zinc-950 sm:max-w-[220px]">{fileName}</span></p>
              </div>
              {cues.length > 0 && <SubtitleLineBadge count={cues.length} />}
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_30px_90px_rgba(0,122,255,0.10)] lg:rounded-[2.25rem]">
            <div className="grid gap-4 border-b border-zinc-200 p-4 lg:grid-cols-[minmax(180px,0.85fr)_minmax(180px,0.85fr)_minmax(220px,1fr)_auto] lg:items-end lg:gap-4 lg:p-7">
              <input ref={fileInputRef} type="file" accept=".srt,.vtt,.ass,.ssa" onChange={handleFileUpload} className="sr-only" />
              <div className="grid gap-2 text-sm font-bold text-zinc-700">
                Upload subtitle file
                <button type="button" onClick={() => fileInputRef.current?.click()} className="relative inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-900 transition hover:bg-blue-50 hover:text-[#007AFF]">
                  <Upload size={17} /> Choose file
                </button>
              </div>
              <label className="grid gap-2 text-sm font-bold text-zinc-700">
                Target language
                <select value={selectedLanguage} onChange={(event) => setSelectedLanguage(event.target.value)} className="h-12 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-950 outline-none transition hover:bg-blue-50 focus:border-[#007AFF]">
                  <option value="" disabled>Selected language</option>
                  {LANGUAGES.map((language) => <option key={language.code} value={language.code}>{language.label}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3 lg:min-w-[230px]"><button onClick={translateAllRows} disabled={isTranslating || cues.length === 0 || !selectedLanguage} className="h-12 rounded-2xl bg-[#007AFF] px-4 text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,122,255,0.24)] transition hover:bg-[#006FE8] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:shadow-none">{isTranslating ? `${progress}%` : "Translate"}</button><button onClick={downloadTranslatedSrt} disabled={cues.length === 0} className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-950 transition hover:bg-blue-50 hover:text-[#007AFF] disabled:cursor-not-allowed disabled:text-zinc-300">Save As</button></div>
            </div>


            {isTranslating && <div className="h-1 bg-blue-50"><div className="h-full bg-[#007AFF] transition-all duration-300" style={{ width: `${progress}%` }} /></div>}
            {cues.length === 0 ? <DropzoneEmptyState isDragging={isDragging} uploadError={uploadError} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onBrowse={() => fileInputRef.current?.click()} /> : <SubtitleTable cues={cues} targetLanguage={selectedLanguage} updateTranslatedText={updateTranslatedText} />}
          </div>
          <RelaySubRecentHistory history={history} isAuthenticated={false} />
        </div>
      </section>

      <FeaturesSection title={featuresTitle} items={featureItems} />
      <LanguagesShowcase />
      <TestimonialsSection />
      <FaqSection title={faqTitle} items={faqItems} />
    </main>
  );
}

function RelaySubRecentHistory({ history, isAuthenticated }: { history: RelaySubHistoryItem[]; isAuthenticated: boolean }) {
  return (
    <section className="mt-5 rounded-[1.5rem] border border-zinc-200/70 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.05)] lg:rounded-[2rem] lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black tracking-tight text-zinc-950">Recent subtitles</h3>
          <p className="mt-1 text-sm font-semibold text-zinc-500">Last 10 translated on this device</p>
        </div>
        <a href="/login?callbackUrl=/relaysub" className="inline-flex h-10 items-center rounded-full bg-[#007AFF] px-4 text-sm font-bold text-white">
          Login
        </a>
      </div>
      {!isAuthenticated ? (
        <div className="mt-4 rounded-2xl bg-zinc-50 p-4">
          <strong className="block text-sm font-black text-zinc-950">Login to see recent subtitles</strong>
          <span className="mt-1 block text-sm font-semibold leading-6 text-zinc-500">Your last 10 translated subtitle files appear here after you sign in.</span>
        </div>
      ) : history.length ? (
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {history.map((item) => (
            <div key={item.id} className="grid grid-cols-[34px_minmax(0,1fr)] items-center gap-3 rounded-2xl bg-zinc-50 p-3">
              <Clock3 size={18} className="text-[#007AFF]" />
              <div className="min-w-0">
                <strong className="block truncate text-sm font-black text-zinc-950">{item.fileName}</strong>
                <span className="mt-0.5 block truncate text-xs font-semibold text-zinc-500">{item.language} - {item.lineCount} lines</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl bg-zinc-50 p-4">
          <strong className="block text-sm font-black text-zinc-950">No history yet</strong>
          <span className="mt-1 block text-sm font-semibold leading-6 text-zinc-500">Translate a subtitle and it will appear here on this browser.</span>
        </div>
      )}
    </section>
  );
}

function FeaturesSection({ title, items }: { title: string; items: EditableItem[] }) {
  const icons = [Zap, FileText, Lock, Smartphone];
  return <section id="features" className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><AnimatedReveal><div className="mx-auto max-w-3xl text-center"><span className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400">Features</span><h2 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">{title}</h2></div></AnimatedReveal><div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{items.map((feature, index) => { const Icon = icons[index % icons.length]; return <AnimatedReveal key={`${feature.title}-${index}`} delay={(index % 4) * 0.07}><article className="group h-full rounded-3xl bg-white p-7 border border-zinc-200/50 flex flex-col apple-feature-shadow"><div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#0066FF] text-white shadow-[0_10px_24px_rgba(0,122,255,0.32)] transition-transform duration-300 group-hover:scale-105"><Icon size={21} /></div><h3 className="text-xl font-bold tracking-tight text-zinc-950">{feature.title}</h3><p className="mt-3 text-sm font-medium leading-6 text-zinc-500 flex-1">{feature.description}</p>
{index === 3 && (
  <div className="mt-6 pt-5 border-t border-zinc-100">
    <a href="https://t.me/relaysub_bot/app" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-[#007AFF] px-4 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,122,255,0.24)] transition hover:bg-[#006FE8]">
      <img src={RELAYSUB_SQUARE_ICON} alt="" className="h-5 w-5 rounded-md object-cover" />
      <span>Open Telegram Mini App</span>
    </a>
  </div>
)}
</article></AnimatedReveal>; })}</div></div></section>;
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <AnimatedReveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400">Loved by creators</span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">Why people use RelaySub.</h2>
            <p className="mt-4 text-base font-medium leading-7 text-zinc-500">Editors, translators, and creators around the world use RelaySub to translate subtitle files in seconds — straight from the browser.</p>
          </div>
        </AnimatedReveal>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {relaySubTestimonials.map((item, index) => (
            <AnimatedReveal key={`${item.name}-${index}`} delay={(index % 3) * 0.08}>
              <article className="h-full rounded-3xl bg-white p-6 border border-zinc-200/50 apple-feature-shadow">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black text-white" style={{ backgroundColor: item.color }}>{item.initials}</div>
                  <div>
                    <p className="text-sm font-bold text-zinc-950">{item.name}</p>
                    <p className="text-xs font-semibold text-zinc-400">{item.handle}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-0.5 text-[#FFB400]">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star key={star} size={15} className="fill-current" />
                  ))}
                </div>
                <p dir={item.rtl ? "rtl" : "ltr"} className={`mt-3 text-sm font-medium leading-6 text-zinc-600 ${item.rtl ? "text-right" : ""}`}>{item.quote}</p>
              </article>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ title, items }: { title: string; items: EditableItem[] }) {
  return <section id="faq" className="bg-zinc-50/80 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="mx-auto max-w-2xl"><AnimatedReveal><div className="text-center"><span className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400">FAQ</span><h2 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">{title}</h2></div></AnimatedReveal><AnimatedReveal delay={0.1}><div className="mt-10"><FAQAccordion faqs={toAccordionFaqs(items)} /></div></AnimatedReveal></div></section>;
}

function RelaySubDemoPreview() {
  const [hasError, setHasError] = useState(false);
  const [ready, setReady] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Mouse-driven 3D tilt (enabled only after the entrance animation finishes).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 18 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 18 });

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!ready || reduceMotion || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div className="mx-auto w-full max-w-[560px] [perspective:1300px]">
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { rotateX: 16, y: 36, opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { rotateX: 0, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 64, damping: 17, delay: 0.05 }}
        onAnimationComplete={() => setReady(true)}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          ref={frameRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
          style={{
            rotateX: ready && !reduceMotion ? rotX : 0,
            rotateY: ready && !reduceMotion ? rotY : 0,
            transformStyle: "preserve-3d",
          }}
          className="relative rounded-[1.4rem] bg-zinc-900 p-2 shadow-[0_34px_90px_rgba(0,122,255,0.22)]"
        >
          <div className="overflow-hidden rounded-[1.05rem] bg-white">
            {/* window top bar — short, like a default desktop window */}
            <div className="flex h-6 items-center gap-1.5 bg-white px-3 sm:h-7">
              <span className="h-2 w-2 rounded-full bg-[#ff5f57] sm:h-2.5 sm:w-2.5" />
              <span className="h-2 w-2 rounded-full bg-[#febc2e] sm:h-2.5 sm:w-2.5" />
              <span className="h-2 w-2 rounded-full bg-[#28c840] sm:h-2.5 sm:w-2.5" />
            </div>
            {/* Reserve the video's aspect ratio so the frame never collapses or
                jumps while the video loads — the previous version had no fixed
                height, which made the hero look broken before playback. */}
            <div className="relative aspect-[1736/1032] w-full bg-zinc-50">
              {hasError ? (
                <div className="absolute inset-0 grid place-items-center p-6 text-center">
                  <div>
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#007AFF]"><FileText size={26} /></div>
                    <p className="text-sm font-bold text-zinc-950">RelaySub demo</p>
                    <p className="mt-1 text-xs font-semibold text-zinc-400">The demo video is unavailable right now.</p>
                  </div>
                </div>
              ) : (
                <video
                  className="absolute inset-0 block h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  controls={false}
                  controlsList="nodownload noplaybackrate noremoteplayback"
                  disablePictureInPicture
                  onContextMenu={(event) => event.preventDefault()}
                  onError={() => setHasError(true)}
                >
                  <source src="/apps/relaysub-demo.mp4" type="video/mp4" />
                </video>
              )}
              {/* subtle screen glare */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/10" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SubtitleLineBadge({ count }: { count: number }) {
  return <span className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full bg-[#FFD60A] px-3 text-[11px] font-black text-zinc-800 shadow-[0_10px_24px_rgba(255,214,10,0.22)] sm:h-11 sm:px-4 sm:text-xs"><FileText size={14} className="text-zinc-800" />{count.toLocaleString()} Subtitle lines</span>;
}

function DropzoneEmptyState({ isDragging, uploadError, onDrop, onDragOver, onDragLeave, onBrowse }: { isDragging: boolean; uploadError: string; onDrop: (event: DragEvent<HTMLDivElement>) => void; onDragOver: (event: DragEvent<HTMLDivElement>) => void; onDragLeave: (event: DragEvent<HTMLDivElement>) => void; onBrowse: () => void }) {
  return <div onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave} className={`m-3 grid min-h-[13rem] cursor-pointer place-items-center rounded-[1.25rem] border-2 border-dashed p-4 text-center transition-all sm:m-6 sm:min-h-[22rem] sm:rounded-[2rem] sm:p-8 ${isDragging ? "border-[#007AFF] bg-blue-50 shadow-[inset_0_0_0_1px_rgba(0,122,255,0.16)]" : "border-zinc-200 bg-white hover:border-[#007AFF] hover:bg-blue-50/55"}`} onClick={onBrowse} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onBrowse(); }}><div className="max-w-lg"><div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[1.05rem] transition-colors sm:mb-5 sm:h-20 sm:w-20 sm:rounded-[1.75rem] ${isDragging ? "bg-[#007AFF] text-white" : "bg-blue-50 text-[#007AFF]"}`}><Upload size={24} /></div><h3 className="text-lg font-black tracking-tight text-zinc-950 sm:text-2xl">Drop your subtitle file here.</h3><p className="mt-2 text-xs font-medium leading-5 text-zinc-500 sm:mt-3 sm:text-sm sm:leading-6">Upload an .srt, .vtt, or .ass file, or drag and drop on desktop.</p><div className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#007AFF] px-4 py-2 text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,122,255,0.22)] sm:mt-6 sm:min-h-11 sm:px-5 sm:py-3"><FileText size={16} /> Upload subtitle</div>{uploadError && <p className="mt-4 text-sm font-bold text-red-600">{uploadError}</p>}</div></div>;
}

function SubtitleTable({ cues, targetLanguage, updateTranslatedText }: { cues: SubtitleCue[]; targetLanguage: string; updateTranslatedText: (index: number, value: string) => void }) {
  return <div className="max-h-[720px] overflow-auto"><div className="grid gap-3 p-4 lg:hidden">{cues.map((cue, index) => { const originalDirection = getTextDirection(cue.originalText); const translatedDirection = getTranslatedDirection(cue.translatedText, targetLanguage); return <article key={`${cue.id}-${cue.start}-${index}-mobile`} className="rounded-[1.25rem] bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)]"><div className="mb-3 flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-400">Subtitle {cue.id}</p><p className="mt-1 font-mono text-[11px] font-semibold text-zinc-500">{cue.start} → {cue.end}</p></div><span className={`shrink-0 text-[10px] font-black uppercase tracking-[0.12em] ${getStatusClass(cue.status)}`}>{cue.status}</span></div><p dir={originalDirection} className={`mb-3 whitespace-pre-wrap rounded-2xl bg-zinc-50 p-3 text-sm font-semibold leading-6 text-zinc-700 ${getTextAlignClass(originalDirection)}`}>{cue.originalText}</p><textarea dir={translatedDirection} value={cue.translatedText} onChange={(event) => updateTranslatedText(index, event.target.value)} className={`min-h-28 w-full resize-y rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold leading-6 text-zinc-950 outline-none transition focus:border-[#007AFF] focus:bg-white ${getTextAlignClass(translatedDirection)}`} placeholder="Translation will appear here..." /></article>; })}</div><div className="hidden lg:block"><table className="w-full min-w-[980px] border-collapse text-left text-sm"><thead className="sticky top-0 z-10 bg-blue-50 text-[10px] uppercase tracking-[0.18em] text-zinc-400"><tr><th className="px-5 py-4">No.</th><th className="px-5 py-4">From</th><th className="px-5 py-4">To</th><th className="px-5 py-4">Original</th><th className="px-5 py-4">Translated</th><th className="px-5 py-4">Status</th></tr></thead><tbody>{cues.map((cue, index) => { const originalDirection = getTextDirection(cue.originalText); const translatedDirection = getTranslatedDirection(cue.translatedText, targetLanguage); return <tr key={`${cue.id}-${cue.start}-${index}`} className="border-t border-zinc-100 align-top"><td className="px-5 py-4 font-bold text-zinc-400">{cue.id}</td><td className="px-5 py-4 font-mono text-xs text-zinc-500">{cue.start}</td><td className="px-5 py-4 font-mono text-xs text-zinc-500">{cue.end}</td><td dir={originalDirection} className={`max-w-sm whitespace-pre-wrap px-5 py-4 font-medium leading-6 text-zinc-700 ${getTextAlignClass(originalDirection)}`}>{cue.originalText}</td><td className="px-5 py-4"><textarea dir={translatedDirection} value={cue.translatedText} onChange={(event) => updateTranslatedText(index, event.target.value)} className={`min-h-24 w-full resize-y rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-medium leading-6 text-zinc-950 outline-none transition focus:border-[#007AFF] focus:bg-white ${getTextAlignClass(translatedDirection)}`} placeholder="Translation will appear here..." /></td><td className={`px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] ${getStatusClass(cue.status)}`}>{cue.status}</td></tr>; })}</tbody></table></div></div>;
}

function getBlock(schema: any, type: string) { return schema.sections.find((block: any) => block.type === type && block.visible !== false); }
function getString(data: Record<string, unknown> | undefined, key: string, fallback = "") { const value = data?.[key]; return typeof value === "string" && value.trim() ? value : fallback; }
function getItems(data: Record<string, unknown> | undefined, fallback: EditableItem[]): EditableItem[] { const items = data?.items; if (!Array.isArray(items)) return fallback; const normalized: EditableItem[] = []; for (const item of items) { if (!item || typeof item !== "object") continue; const record = item as Record<string, unknown>; const title = getString(record, "title"); const description = getString(record, "description"); if (title || description) normalized.push({ title, description }); } return normalized.length ? normalized : fallback; }
function toAccordionFaqs(items: EditableItem[]) { return items.map((item) => ({ question: item.title || "", answer: item.description || "" })).filter((item) => item.question || item.answer); }
function getStableFeatureItems(data: Record<string, unknown> | undefined) { const items = getItems(data, fallbackFeatures); return items.length >= 3 ? items.slice(0, 3) : fallbackFeatures; }
function getRelaySubButtonUrl(value: string) { return value === "#translator" || value === "/relaysub#" || value === "/relaysub" || value === "/apps/relaysub#" || value === "/apps/relaysub" ? RELAYSUB_TRANSLATOR_URL : value; }
function withAlpha(hex: string, alpha: number) { const normalized = hex.replace("#", ""); if (normalized.length !== 6) return `rgba(0,122,255,${alpha})`; const r = parseInt(normalized.slice(0, 2), 16); const g = parseInt(normalized.slice(2, 4), 16); const b = parseInt(normalized.slice(4, 6), 16); return `rgba(${r},${g},${b},${alpha})`; }
function getStatusClass(status: SubtitleCue["status"]) { if (status === "done") return "text-green-600"; if (status === "error") return "text-red-600"; if (status === "translating") return "text-[#007AFF]"; return "text-zinc-400"; }
function getAiSubtitleEstimate(lineCount: number) { if (lineCount <= 0) return "$0.00"; const cents = Math.max(99, Math.ceil(lineCount * 1.8)); return `$${(cents / 100).toFixed(2)}`; }
function getLanguageDirection(languageCode: string): "ltr" | "rtl" { return RTL_LANGUAGE_CODES.has(languageCode) ? "rtl" : "ltr"; }
function getTextDirection(text: string): "ltr" | "rtl" { const chars = Array.from(text); for (const char of chars) { if (RTL_CHARACTER_REGEX.test(char)) return "rtl"; if (LTR_CHARACTER_REGEX.test(char)) return "ltr"; } return "ltr"; }
function getTranslatedDirection(text: string, targetLanguage: string): "ltr" | "rtl" { if (targetLanguage) return getLanguageDirection(targetLanguage); return getTextDirection(text); }
function getTextAlignClass(direction: "ltr" | "rtl") { return direction === "rtl" ? "text-right" : "text-left"; }
function parseSrt(fileContent: string): SubtitleCue[] { const normalized = fileContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim(); if (!normalized) return []; return normalized.split(/\n{2,}/).map((block, index) => parseCueBlock(block, index + 1)).filter((cue): cue is SubtitleCue => Boolean(cue)); }
function parseCueBlock(block: string, fallbackId: number): SubtitleCue | null { const lines = block.split("\n").map((line) => line.trimEnd()); const rawId = Number.parseInt(lines[0], 10); const timeLineIndex = Number.isNaN(rawId) ? 0 : 1; const timeLine = lines[timeLineIndex]; if (!timeLine || !/\s+-->\s+/.test(timeLine)) return null; const [start, end] = timeLine.split(/\s+-->\s+/); const text = lines.slice(timeLineIndex + 1).join("\n").trim(); return { id: Number.isNaN(rawId) ? fallbackId : rawId, start, end, originalText: text, translatedText: "", status: "idle" }; }
function normalizeTime(time: string, separator: "," | "."): string { const value = time.trim().split(/\s+/)[0] || time.trim(); return separator === "," ? value.replace(".", ",") : value.replace(",", "."); }

function exportSrt(cues: SubtitleCue[]): string { return cues.map((cue, index) => [String(index + 1), `${normalizeTime(cue.start, ",")} --> ${normalizeTime(cue.end, ",")}`, cue.translatedText.trim() || cue.originalText.trim()].join("\n")).join("\n\n") + "\n"; }

function exportVtt(cues: SubtitleCue[]): string { return "WEBVTT\n\n" + cues.map((cue, index) => [String(index + 1), `${normalizeTime(cue.start, ".")} --> ${normalizeTime(cue.end, ".")}`, cue.translatedText.trim() || cue.originalText.trim()].join("\n")).join("\n\n") + "\n"; }

function exportAss(cues: SubtitleCue[], template: string): string { let out = template; cues.forEach((cue, index) => { const text = (cue.translatedText.trim() || cue.originalText.trim()).replace(/\n/g, "\\N"); out = out.split(`{{RELAYSUB_${index}}}`).join(text); }); return out.endsWith("\n") ? out : out + "\n"; }

function parseVtt(content: string): SubtitleCue[] { let normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim(); normalized = normalized.replace(/^WEBVTT[^\n]*\n?/i, "").trim(); const cues: SubtitleCue[] = []; normalized.split(/\n{2,}/).forEach((block) => { const head = block.trim(); if (!head || /^(NOTE|STYLE|REGION)\b/i.test(head)) return; const cue = parseCueBlock(block, cues.length + 1); if (!cue) return; cues.push({ ...cue, id: cues.length + 1, start: cue.start.trim().split(/\s+/)[0], end: cue.end.trim().split(/\s+/)[0] }); }); return cues; }

function splitFields(value: string, count: number): string[] { const parts: string[] = []; let rest = value; for (let i = 0; i < count - 1; i += 1) { const idx = rest.indexOf(","); if (idx < 0) { parts.push(rest); rest = ""; break; } parts.push(rest.slice(0, idx)); rest = rest.slice(idx + 1); } parts.push(rest); return parts; }

function parseAss(content: string): { cues: SubtitleCue[]; template: string } { const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n"); const templateLines = lines.slice(); const cues: SubtitleCue[] = []; let formatFields: string[] | null = null; let inEvents = false; for (let i = 0; i < lines.length; i += 1) { const line = lines[i]; const trimmed = line.trim(); if (/^\[[^\]]*\]\s*$/.test(trimmed)) { inEvents = /^\[events\]\s*$/i.test(trimmed); continue; } if (!inEvents) continue; if (/^format\s*:/i.test(trimmed)) { formatFields = trimmed.replace(/^format\s*:/i, "").split(",").map((part) => part.trim().toLowerCase()); continue; } const dialogue = line.match(/^(\s*dialogue\s*:)(.*)$/i); if (!dialogue || !formatFields) continue; const startIdx = formatFields.indexOf("start"); const endIdx = formatFields.indexOf("end"); const textIdx = formatFields.indexOf("text"); if (startIdx < 0 || endIdx < 0 || textIdx < 0) continue; const parts = splitFields(dialogue[2], formatFields.length); const rawText = parts[textIdx] ?? ""; const cleanText = rawText.replace(/\{[^}]*\}/g, "").replace(/\\[Nn]/g, "\n").replace(/\\h/gi, " ").trim(); if (!cleanText) continue; const start = (parts[startIdx] ?? "").trim(); const end = (parts[endIdx] ?? "").trim(); const cueIndex = cues.length; parts[textIdx] = `{{RELAYSUB_${cueIndex}}}`; templateLines[i] = dialogue[1] + parts.join(","); cues.push({ id: cueIndex + 1, start, end, originalText: cleanText, translatedText: "", status: "idle" }); } return { cues, template: templateLines.join("\n") }; }
function downloadTextFile(filename: string, content: string) { const blob = new Blob([content], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url); }
async function trackRelaySubUsage(data: { targetLanguage: string; lineCount: number; translatedLineCount: number }) { try { await fetch("/api/relaysub/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), keepalive: true }); } catch {} }
async function translateCuesFast(cues: SubtitleCue[], targetLanguage: string, onProgress: (done: number, total: number) => void): Promise<string[]> { const chunks = createTranslationChunks(cues); const output = new Array<string>(cues.length).fill(""); let completed = 0; await runWithConcurrency(chunks, 6, async (chunk) => { const translatedLines = await translateChunk(chunk.items.map((item) => item.text), targetLanguage); chunk.items.forEach((item, index) => { output[item.index] = translatedLines[index] || ""; }); completed += chunk.items.length; onProgress(completed, cues.length); }); return output; }
function createTranslationChunks(cues: SubtitleCue[]) { const chunks: { items: { index: number; text: string }[] }[] = []; let current: { index: number; text: string }[] = []; let charCount = 0; cues.forEach((cue, index) => { const text = cue.originalText.trim(); if (!text) return; if (current.length >= 40 || charCount + text.length > 4500) { chunks.push({ items: current }); current = []; charCount = 0; } current.push({ index, text }); charCount += text.length; }); if (current.length) chunks.push({ items: current }); return chunks; }
async function translateChunk(lines: string[], targetLanguage: string): Promise<string[]> { if (lines.length === 1) return [await translateText(lines[0], targetLanguage)]; const separator = "\n<<<RELAYSUB_SPLIT_TOKEN>>>\n"; const translated = await translateText(lines.join(separator), targetLanguage); const split = translated.split(/\s*<<<RELAYSUB_SPLIT_TOKEN>>>\s*/).map((item) => item.trim()); if (split.length === lines.length) return split; return Promise.all(lines.map((line) => translateText(line, targetLanguage).catch(() => ""))); }
async function runWithConcurrency<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) { let cursor = 0; const workers = Array.from({ length: Math.min(limit, items.length) }, async () => { while (cursor < items.length) { const item = items[cursor]; cursor += 1; await worker(item); } }); await Promise.all(workers); }
async function translateText(text: string, targetLanguage: string): Promise<string> { if (!text.trim()) return ""; const params = new URLSearchParams({ client: "gtx", sl: "auto", tl: targetLanguage, dt: "t", q: text }); const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params.toString()}`); if (!response.ok) throw new Error("Translation failed"); const payload = await response.json(); return payload?.[0]?.map((segment: unknown[]) => segment?.[0]).filter(Boolean).join("") ?? ""; }
