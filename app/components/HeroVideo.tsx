"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import heroPoster from "../assets/hero-poster.webp";

/* The hero plays three clips of the NSU buses in turn, then starts over.

   Each clip has a phone cut and a wider cut. The two portrait clips are
   shown whole on phones and as a centre band on wider screens; the
   landscape clip the other way round. The broadcaster's and creators'
   marks were cropped out of the frames, so the clip that is playing is
   credited in the corner instead. */
const CLIPS = [
  {
    small: "/video/warming-up-mobile.mp4", // 480x764, about 0.3 MB
    large: "/video/warming-up.mp4", // 1080x576, about 0.8 MB
    credit: "NSU Daily Hub",
  },
  {
    small: "/video/bus-service-mobile.mp4", // 480x686, about 0.4 MB
    large: "/video/bus-service.mp4", // 720x384, about 0.8 MB
    credit: "The Daily NSU, Rafiur Rahim Rafi",
  },
  {
    small: "/video/ac-bus-mobile.mp4", // 640x298, about 0.9 MB
    large: "/video/ac-bus.mp4", // 1152x538, about 3.8 MB
    credit: "NSU TV & Radio",
  },
];

/* The still under the footage is a frame of the AC bus clip. */
const POSTER_CREDIT = "NSU TV & Radio";

/* How close to the end of a clip the next one starts downloading. */
const PRELOAD_SECONDS = 4;

type Choice = "play" | "pause" | null;

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
}

/* Muted background footage for the hero.

   A still frame is always underneath, served at the size the screen
   needs. Nothing downloads until the hero is actually on screen, and the
   footage only starts by itself when all of these hold: the visitor has
   not asked for reduced motion, the browser is not in data saver mode or
   on a slow connection, and the visitor has not paused it. The next clip
   is fetched only in the last few seconds of the one playing, and two
   video elements take turns so each clip crossfades into the next.

   Whatever the visitor chooses with the play and pause button wins over
   those defaults, and playback stops while the hero is scrolled away or
   the tab is hidden, then resumes on return. */
export function HeroVideo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null]);
  const choice = useRef<Choice>(null);
  const syncRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [clip, setClip] = useState(0);
  const [front, setFront] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const videos = videoRefs.current;
    if (!wrap || !videos[0] || !videos[1]) return;
    const pair = videos as HTMLVideoElement[];

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px)");
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike })
      .connection;
    let inView = false;
    let active = 0; // which element is in front
    let index = 0; // which clip it holds

    const srcFor = (i: number) => (small.matches ? CLIPS[i].small : CLIPS[i].large);

    const load = (video: HTMLVideoElement, i: number) => {
      const src = srcFor(i);
      if (video.getAttribute("src") !== src) {
        video.src = src;
        video.load();
      }
    };

    const constrained = () =>
      connection?.saveData === true ||
      ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");

    const wantsToPlay = () =>
      choice.current === "play" ||
      (choice.current === null && !motion.matches && !constrained());

    const sync = () => {
      const video = pair[active];
      if (wantsToPlay() && inView && !document.hidden) {
        load(video, index);
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

    const onPlaying = () => setStarted(true);

    /* Fetch the next clip into the hidden element near the end. */
    const onTimeUpdate = (event: Event) => {
      const video = event.currentTarget as HTMLVideoElement;
      if (video !== pair[active] || !video.duration) return;
      if (video.duration - video.currentTime < PRELOAD_SECONDS) {
        load(pair[1 - active], (index + 1) % CLIPS.length);
      }
    };

    /* Swap the elements and play the next clip. */
    const onEnded = (event: Event) => {
      if (event.currentTarget !== pair[active]) return;
      index = (index + 1) % CLIPS.length;
      active = 1 - active;
      load(pair[active], index);
      pair[active].currentTime = 0;
      setClip(index);
      setFront(active);
      sync();
    };

    for (const video of pair) {
      video.addEventListener("playing", onPlaying);
      video.addEventListener("timeupdate", onTimeUpdate);
      video.addEventListener("ended", onEnded);
    }

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(wrap);

    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    connection?.addEventListener?.("change", sync);

    return () => {
      for (const video of pair) {
        video.removeEventListener("playing", onPlaying);
        video.removeEventListener("timeupdate", onTimeUpdate);
        video.removeEventListener("ended", onEnded);
      }
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
       context and trap the controls underneath the hero copy. The
       footage and scrim paint below the z-10 copy anyway; the controls'
       z-20 lifts them above. */
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <Image src={heroPoster} alt="" fill preload sizes="100vw" className="object-cover" />

      {[0, 1].map((slot) => (
        <video
          key={slot}
          ref={(el) => {
            videoRefs.current[slot] = el;
          }}
          data-front={started && front === slot}
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 ease-out data-[front=true]:opacity-100 motion-reduce:transition-none"
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        />
      ))}

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

      <div className="absolute right-4 bottom-4 z-20 flex items-center gap-3 sm:right-6 sm:bottom-6">
        <p className="rounded-tag bg-media/75 px-2 py-1 text-xs text-on-media-muted">
          Video: {started ? CLIPS[clip].credit : POSTER_CREDIT}
        </p>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause background video" : "Play background video"}
          className="pressable flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-media text-on-media hover:bg-utility"
        >
          {playing ? (
            <Pause className="size-4" aria-hidden="true" />
          ) : (
            <Play className="size-4 translate-x-px" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
