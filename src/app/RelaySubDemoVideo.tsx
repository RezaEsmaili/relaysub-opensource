"use client";

import { useEffect } from "react";

export function RelaySubDemoVideo() {
  useEffect(() => {
    let cancelled = false;

    async function mountVideo() {
      const videoUrl = "/apps/relaysub-demo.mp4";

      // Do not remove the existing visual preview unless the real MP4 exists.
      // This prevents the empty white box problem when the video has not been uploaded yet.
      const check = await fetch(videoUrl, { method: "HEAD", cache: "no-store" }).catch(() => null);
      if (cancelled || !check?.ok) return;

      const qrText = Array.from(document.querySelectorAll("p")).find((element) =>
        element.textContent?.includes("Scan to share RelaySub")
      );

      const qrCard = qrText?.closest("div.text-center");
      const mediaColumn = qrCard?.parentElement;

      if (!qrCard || !mediaColumn || document.getElementById("relaysub-demo-video-slot")) {
        return;
      }

      // Remove the old static phone mockup only after the real demo video is confirmed.
      Array.from(mediaColumn.children).forEach((child) => {
        if (child !== qrCard && child.id !== "relaysub-demo-video-slot") {
          child.remove();
        }
      });

      const wrapper = document.createElement("div");
      wrapper.id = "relaysub-demo-video-slot";
      wrapper.className = "w-full max-w-[620px] overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-2 shadow-[0_22px_70px_rgba(15,23,42,0.10)]";

      const video = document.createElement("video");
      video.className = "block w-full rounded-[1.5rem]";
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      video.setAttribute("aria-label", "RelaySub demo video");

      const source = document.createElement("source");
      source.src = videoUrl;
      source.type = "video/mp4";

      video.appendChild(source);
      wrapper.appendChild(video);
      mediaColumn.insertBefore(wrapper, qrCard);
      void video.play().catch(() => undefined);
    }

    void mountVideo();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
