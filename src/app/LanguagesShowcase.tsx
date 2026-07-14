"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import { LANGUAGES } from "./languages";

// Language code → ISO 3166-1 alpha-2 country code, used to load a flag image
// from flagcdn.com (free, public-domain flags that render identically on every
// platform — unlike emoji flags, which show as letters on Windows).
const LANG_COUNTRY: Record<string, string> = {
  af: "za", sq: "al", am: "et", ar: "sa", hy: "am", az: "az", eu: "es", be: "by",
  bn: "bd", bs: "ba", bg: "bg", ca: "es", ceb: "ph", "zh-CN": "cn", "zh-TW": "tw", co: "fr",
  hr: "hr", cs: "cz", da: "dk", nl: "nl", en: "gb", et: "ee", fi: "fi",
  fr: "fr", fy: "nl", gl: "es", ka: "ge", de: "de", el: "gr", gu: "in", ht: "ht",
  ha: "ng", haw: "us", he: "il", hi: "in", hu: "hu", is: "is", ig: "ng",
  id: "id", ga: "ie", it: "it", ja: "jp", jv: "id", kn: "in", kk: "kz", km: "kh",
  rw: "rw", ko: "kr", ky: "kg", lo: "la", la: "va", lv: "lv", lt: "lt",
  lb: "lu", mk: "mk", mg: "mg", ms: "my", ml: "in", mt: "mt", mi: "nz", mr: "in",
  mn: "mn", my: "mm", ne: "np", no: "no", or: "in", ps: "af", fa: "ir", pl: "pl",
  pt: "pt", pa: "in", ro: "ro", ru: "ru", sm: "ws", gd: "gb", sr: "rs", st: "ls",
  sn: "zw", sd: "pk", si: "lk", sk: "sk", sl: "si", so: "so", es: "es", su: "id",
  sw: "ke", sv: "se", tl: "ph", tg: "tj", ta: "in", tt: "ru", te: "in", th: "th",
  tr: "tr", tk: "tm", uk: "ua", ur: "pk", ug: "cn", uz: "uz", vi: "vn", cy: "gb",
  xh: "za", yi: "il", yo: "ng", zu: "za",
};

// Languages with no single country flag get a dedicated local image.
const SPECIAL_FLAG: Record<string, string> = {
  eo: "/flags/esperanto.svg",
  ku: "/flags/globe.svg",
  hmn: "/flags/globe.svg",
};

function flagSrc(code: string): string {
  if (SPECIAL_FLAG[code]) return SPECIAL_FLAG[code];
  const iso = LANG_COUNTRY[code];
  return iso ? `https://flagcdn.com/${iso}.svg` : "/flags/globe.svg";
}

function LangChip({ code, label }: { code: string; label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl border border-zinc-200/70 bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={flagSrc(code)}
        alt=""
        width={24}
        height={16}
        loading="lazy"
        className="h-4 w-6 rounded-[3px] object-cover ring-1 ring-black/5"
      />
      {label}
    </span>
  );
}

// Split the languages into rows for the alternating marquee.
const ROW_COUNT = 5;
const ROWS = (() => {
  const rows: { code: string; label: string }[][] = Array.from({ length: ROW_COUNT }, () => []);
  LANGUAGES.forEach((language, index) => rows[index % ROW_COUNT].push(language));
  return rows;
})();

export function LanguagesShowcase() {
  const [query, setQuery] = useState("");
  const reduceMotion = useReducedMotion();
  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const filtered = useMemo(
    () => (searching ? LANGUAGES.filter((language) => language.label.toLowerCase().includes(q)) : []),
    [q, searching]
  );

  // Static grid when searching or for reduced-motion users; animated rows otherwise.
  const showGrid = searching || reduceMotion;

  return (
    <section id="languages" className="bg-zinc-50/80 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <AnimatedReveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400">Languages</span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">Supports 100+ languages.</h2>
            <p className="mt-4 text-base font-medium leading-7 text-zinc-500">
              Translate your subtitles into the language your audience speaks — from Spanish and Arabic to Japanese and beyond.
            </p>
          </div>
        </AnimatedReveal>

        <AnimatedReveal delay={0.05}>
          <div className="relative mx-auto mt-8 max-w-md">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for a language..."
              aria-label="Search for a language"
              className="h-12 w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 text-sm font-medium text-zinc-900 shadow-sm outline-none transition focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10"
            />
          </div>
        </AnimatedReveal>

        {showGrid ? (
          <div className={`mt-8 ${searching ? "" : "max-h-[460px] overflow-y-auto"}`}>
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
              {(searching ? filtered : LANGUAGES).map((language) => (
                <LangChip key={language.code} code={language.code} label={language.label} />
              ))}
              {searching && filtered.length === 0 && (
                <p className="py-8 text-sm font-medium text-zinc-400">No language found for “{query}”.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="lang-marquee-mask relative mt-10 space-y-3 overflow-hidden">
            {ROWS.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex w-max gap-3 hover:[animation-play-state:paused]"
                style={{
                  animation: `${rowIndex % 2 === 0 ? "relaysub-marquee-left" : "relaysub-marquee-right"} ${46 + rowIndex * 6}s linear infinite`,
                }}
              >
                {[...row, ...row].map((language, itemIndex) => (
                  <LangChip key={`${language.code}-${itemIndex}`} code={language.code} label={language.label} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
