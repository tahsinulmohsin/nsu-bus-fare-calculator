"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/* Background video for the hero.

   The video is muted, looped and decorative, so it carries a poster
   frame for the first paint and never autoplays when the visitor has
   asked for reduced motion. A visible play and pause control is
   always available, and playback stops while the tab is hidden so a
   background tab is not decoding frames. */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
      if (event.matches) videoRef.current?.pause();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;

    video.play().then(
      () => setPlaying(true),
      () => setPlaying(false)
    );

    const onVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else if (playing) {
        void video.play();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
    // `playing` is intentionally omitted: this effect only sets up
    // autoplay and the visibility listener once per motion preference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster="/video/hero-poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Scrim. The hero text sits on top of moving footage, so the
          gradient is strong enough to hold contrast on every frame. */}
      <div className="absolute inset-0 bg-slate-950/40" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/25"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause background video" : "Play background video"}
        className="pressable absolute bottom-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-slate-950/60 text-white backdrop-blur-sm hover:bg-slate-950/80 cursor-pointer"
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
