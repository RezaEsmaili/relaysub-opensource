import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RELAYSUB_ROUND_ICON } from "@/lib/relaysub-assets";

export const metadata: Metadata = {
  title: "RelaySub — Subtitle Translator + Editor",
  description: "RelaySub is a free SRT subtitle translator and editor by R22E.",
  manifest: "/relaysub/manifest.webmanifest",
  applicationName: "RelaySub",
  appleWebApp: {
    title: "RelaySub",
    capable: true,
    statusBarStyle: "default",
  },
  themeColor: "#007AFF",
  icons: {
    icon: [
      { url: RELAYSUB_ROUND_ICON, sizes: "192x192", type: "image/png" },
      { url: RELAYSUB_ROUND_ICON, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: RELAYSUB_ROUND_ICON, sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: RELAYSUB_ROUND_ICON, type: "image/png" }],
  },
};

const relaysubRoutePolish = `
  /* RelaySub share icon: fixed Apple-style plus-to-cross morph. */
  main:has(a[href="/relaysub#translator"]) button[aria-expanded].group > div > div:first-child > span:first-child {
    position: relative !important;
    flex: 0 0 42px !important;
    width: 42px !important;
    height: 42px !important;
    min-width: 42px !important;
    min-height: 42px !important;
    display: grid !important;
    place-items: center !important;
    overflow: hidden !important;
    border: 0 !important;
    border-radius: 999px !important;
    background: #007aff !important;
    color: transparent !important;
    font-size: 0 !important;
    line-height: 0 !important;
    text-indent: -9999px !important;
    box-shadow: 0 8px 20px rgba(0, 122, 255, 0.26) !important;
    transform: none !important;
    rotate: 0deg !important;
    transition: none !important;
  }

  main:has(a[href="/relaysub#translator"]) button[aria-expanded].group > div > div:first-child > span:first-child::before,
  main:has(a[href="/relaysub#translator"]) button[aria-expanded].group > div > div:first-child > span:first-child::after {
    content: "" !important;
    position: absolute !important;
    left: 50% !important;
    top: 50% !important;
    width: 17px !important;
    height: 2.6px !important;
    border-radius: 999px !important;
    background: #ffffff !important;
    opacity: 1 !important;
    transform-origin: 50% 50% !important;
    pointer-events: none !important;
    transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1) !important;
    will-change: transform !important;
  }

  main:has(a[href="/relaysub#translator"]) button[aria-expanded].group > div > div:first-child > span:first-child::before {
    transform: translate(-50%, -50%) rotate(0deg) translateZ(0) !important;
  }

  main:has(a[href="/relaysub#translator"]) button[aria-expanded].group > div > div:first-child > span:first-child::after {
    transform: translate(-50%, -50%) rotate(90deg) translateZ(0) !important;
  }

  main:has(a[href="/relaysub#translator"]) button[aria-expanded="true"].group > div > div:first-child > span:first-child::before {
    transform: translate(-50%, -50%) rotate(45deg) translateZ(0) !important;
  }

  main:has(a[href="/relaysub#translator"]) button[aria-expanded="true"].group > div > div:first-child > span:first-child::after {
    transform: translate(-50%, -50%) rotate(-45deg) translateZ(0) !important;
  }

  /* RelaySub FAQ: match RDM/Gelim accordion style. */
  #faq {
    background: #f7f7f8 !important;
    color: #18181b !important;
    padding-top: 6rem !important;
    padding-bottom: 6.5rem !important;
  }

  #faq > div {
    max-width: 42rem !important;
  }

  #faq > div > div:first-child {
    display: block !important;
    border: 0 !important;
    padding-bottom: 0 !important;
    text-align: center !important;
  }

  #faq > div > div:first-child span {
    color: #71717a !important;
  }

  #faq h2 {
    color: #18181b !important;
    font-size: clamp(2.75rem, 5vw, 4.5rem) !important;
    line-height: 0.96 !important;
    letter-spacing: -0.06em !important;
  }

  #faq > div > div:first-child p {
    display: none !important;
  }

  #faq > div > div:nth-child(2) {
    display: flex !important;
    flex-direction: column !important;
    gap: 0.75rem !important;
    margin-top: 2.5rem !important;
    border: 0 !important;
  }

  #faq article {
    display: block !important;
    grid-template-columns: none !important;
    gap: 0 !important;
    cursor: pointer !important;
    overflow: hidden !important;
    border: 1px solid #e4e4e7 !important;
    border-radius: 1rem !important;
    background: #ffffff !important;
    padding: 0 !important;
    box-shadow: none !important;
    transition: border-color 200ms ease, box-shadow 200ms ease !important;
  }

  #faq article:hover,
  #faq article.rs-faq-open {
    border-color: #d4d4d8 !important;
    box-shadow: 0 10px 28px rgba(15, 23, 42, 0.04) !important;
  }

  #faq article h3 {
    position: relative !important;
    display: block !important;
    color: #09090b !important;
    font-size: 1rem !important;
    font-weight: 650 !important;
    line-height: 1.4 !important;
    letter-spacing: -0.015em !important;
    padding: 1.25rem 3rem 1.25rem 1.25rem !important;
    margin: 0 !important;
  }

  #faq article h3::after {
    content: "⌄" !important;
    position: absolute !important;
    right: 1.25rem !important;
    top: 50% !important;
    transform: translateY(-50%) rotate(0deg) !important;
    color: #a1a1aa !important;
    font-size: 1rem !important;
    line-height: 1 !important;
    transition: transform 200ms ease, color 200ms ease !important;
  }

  #faq article.rs-faq-open h3::after {
    transform: translateY(-50%) rotate(180deg) !important;
    color: #007aff !important;
  }

  #faq article p {
    max-height: 0 !important;
    opacity: 0 !important;
    overflow: hidden !important;
    margin: 0 !important;
    padding: 0 1.25rem !important;
    color: #71717a !important;
    font-size: 0.9rem !important;
    font-weight: 500 !important;
    line-height: 1.7 !important;
    transition: max-height 240ms ease, opacity 180ms ease, padding-bottom 220ms ease !important;
  }

  #faq article.rs-faq-open p {
    max-height: 12rem !important;
    opacity: 1 !important;
    padding-bottom: 1.25rem !important;
  }

  @media (max-width: 720px) {
    #faq {
      padding-top: 4.5rem !important;
      padding-bottom: 5rem !important;
    }
    #faq h2 {
      font-size: clamp(2.35rem, 12vw, 3.45rem) !important;
    }
  }
`;

const relaysubFaqAccordionScript = `
  (function () {
    function setupRelaySubFaq() {
      var root = document.getElementById('faq');
      if (!root) return;
      var items = Array.prototype.slice.call(root.querySelectorAll('article'));
      if (!items.length) return;

      items.forEach(function (item) {
        if (item.dataset.rsFaqBound === 'true') return;
        item.dataset.rsFaqBound = 'true';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-expanded', 'false');
        var answer = item.querySelector('p');
        if (answer) answer.setAttribute('aria-hidden', 'true');

        function toggle() {
          var isOpen = item.classList.contains('rs-faq-open');
          items.forEach(function (other) {
            other.classList.remove('rs-faq-open');
            other.setAttribute('aria-expanded', 'false');
            var otherAnswer = other.querySelector('p');
            if (otherAnswer) otherAnswer.setAttribute('aria-hidden', 'true');
          });
          if (!isOpen) {
            item.classList.add('rs-faq-open');
            item.setAttribute('aria-expanded', 'true');
            if (answer) answer.setAttribute('aria-hidden', 'false');
          }
        }

        item.addEventListener('click', toggle);
        item.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggle();
          }
        });
      });
    }

    function boot() {
      setupRelaySubFaq();
      var observer = new MutationObserver(setupRelaySubFaq);
      observer.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(setupRelaySubFaq, 250);
      setTimeout(setupRelaySubFaq, 900);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
    window.addEventListener('pageshow', setupRelaySubFaq);
  })();
`;

export default function RelaySubLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <style>{relaysubRoutePolish}</style>
      <script dangerouslySetInnerHTML={{ __html: relaysubFaqAccordionScript }} />
    </>
  );
}
