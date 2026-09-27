"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { Pause, Play } from "lucide-react";

const POSTER = "/video/hero-poster.webp";
const SOURCE_SMALL = "/video/hero-mobile.mp4"; // 640px, about 1 MB
const SOURCE_LARGE = "/video/hero.mp4"; // 1152px, about 4 MB

type Choice = "play" | "pause" | null;

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
}

/* Muted, looping background footage for the hero.

   Nothing downloads until the hero is actually on screen, and the video
   only starts by itself when all of these hold: the visitor has not
   asked for reduced motion, the browser is not in data saver mode or on
   a slow connection, and the visitor has not paused it. Phones get a
   640px file of about 1 MB instead of the 4 MB desktop file. The poster
   frame covers every case where the video does not play.

   Whatever the visitor chooses with the play and pause button wins over
   those defaults, and playback stops while the hero is scrolled away or
   the tab is hidden, then resumes on return. */
export function HeroVideo() {
  preload(POSTER, { as: "image", fetchPriority: "high" });

  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const choice = useRef<Choice>(null);
  const syncRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const wrap = wrapRef.current;
    if (!video || !wrap) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px)");
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike })
      .connection;
    let inView = false;

    const constrained = () =>
      connection?.saveData === true ||
      ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");

    const wantsToPlay = () =>
      choice.current === "play" ||
      (choice.current === null && !motion.matches && !constrained());

    const sync = () => {
      if (wantsToPlay() && inView && !document.hidden) {
        if (!video.getAttribute("src")) {
          video.src = small.matches ? SOURCE_SMALL : SOURCE_LARGE;
        }
        video.play().then(
          () => setPlaying(true),
          () => setPlaying(false)
        );
      } else {
        if (!video.paused) video.pause();
        setPlaying(false);
      }
    };
    syncRef.current = sync;

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(wrap);

    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    connection?.addEventListener?.("change", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      connection?.removeEventListener?.("change", sync);
    };
  }, []);

  const toggle = () => {
    choice.current = playing ? "pause" : "play";
    syncRef.current();
  };

  return (
    /* No z-index here on purpose: a z-index would create a stacking
       context and trap the control button underneath the hero copy.
       The footage and scrim paint below the z-10 copy anyway; the
       button's z-20 lifts it above. */
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster={POSTER}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Scrim. As on northsouth.edu the footage stays bright on the far
          side; the navy deepens under the headline and toward the foot of
          the hero, where the buttons sit, so the white type holds AA. On a
          phone the text spans the full width, so the scrim is even. */}
      <div className="absolute inset-0 bg-media/70 sm:hidden" aria-hidden="true" />
      <div
        className="absolute inset-0 hidden bg-gradient-to-r from-media/90 via-media/60 to-media/0 sm:block"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-media/60 via-transparent to-transparent"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause background video" : "Play background video"}
        className="pressable absolute right-4 bottom-4 z-20 flex size-12 cursor-pointer items-center justify-center rounded-full bg-media text-on-media hover:bg-utility sm:right-6 sm:bottom-6"
      >
        {playing ? (
          <Pause className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Play className="h-4 w-4 translate-x-px" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
