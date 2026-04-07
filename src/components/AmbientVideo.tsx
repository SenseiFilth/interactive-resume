"use client";

import { useEffect, useRef, useState } from "react";

// ── Tune these two constants for feel ──────────────────────────────────────
const FADE_START_S = 0.75; // seconds before loop point to begin crossfade
const FADE_MS      = 550;  // crossfade duration (ms) — matches easing below
// ──────────────────────────────────────────────────────────────────────────

const VIDEO_STYLE: React.CSSProperties = {
  position: "absolute",
  inset:    0,
  width:    "100%",
  height:   "100%",
  objectFit:"cover",
  filter:   "saturate(1.4) brightness(0.85)",
  // Transition only opacity — GPU composited, zero layout cost
  transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.15, 1)`,
};

/**
 * Dual-layer ambient video with invisible looping.
 *
 * Layer A and Layer B play the same source, with Layer B seeking to
 * duration/2 on mount. They alternate as "primary" (opacity 0.18)
 * and "background" (opacity 0). 750ms before the primary layer
 * reaches its loop point, the layers crossfade — the loop point of
 * the outgoing layer is always hidden behind the incoming layer
 * playing through the middle of its cycle.
 *
 * Both videos keep looping indefinitely via the native `loop` attribute
 * so there are no JS-driven restarts or reloads.
 */
export default function AmbientVideo() {
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);

  // Which layer is currently the "primary" (full opacity) layer
  const [primary, setPrimary] = useState<"A" | "B">("A");

  // Refs so interval closure always reads latest values without re-creating
  const primaryRef  = useRef<"A" | "B">("A");
  const fadingRef   = useRef(false);
  const durationRef = useRef(5); // fallback; updated on loadedmetadata

  useEffect(() => {
    const a = refA.current;
    const b = refB.current;
    if (!a || !b) return;

    // ── Capture real duration once metadata is available ─────────────────
    const onMeta = () => {
      if (a.duration && isFinite(a.duration)) {
        durationRef.current = a.duration;
        // Seek B to the midpoint so it's always offset by half the cycle
        b.currentTime = a.duration / 2;
      }
    };

    if (a.readyState >= 1) {
      onMeta();
    } else {
      a.addEventListener("loadedmetadata", onMeta, { once: true });
    }

    // ── Poll loop boundary — lightweight at 80ms intervals ───────────────
    const interval = window.setInterval(() => {  // 150ms — enough precision, gentler on mobile battery
      if (fadingRef.current) return;

      const active   = primaryRef.current === "A" ? a : b;
      const dur      = durationRef.current;
      const timeLeft = dur - active.currentTime;

      if (timeLeft > 0 && timeLeft <= FADE_START_S) {
        fadingRef.current = true;

        const next: "A" | "B" = primaryRef.current === "A" ? "B" : "A";
        primaryRef.current = next;
        setPrimary(next);

        // Unlock after crossfade completes (+50ms buffer)
        window.setTimeout(() => {
          fadingRef.current = false;
        }, FADE_MS + 50);
      }
    }, 150);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <>
      <video
        ref={refA}
        autoPlay muted loop playsInline
        style={{ ...VIDEO_STYLE, opacity: primary === "A" ? 0.18 : 0 }}
        aria-hidden="true"
      >
        <source src="/videos/ambient-bg.mp4" type="video/mp4" />
      </video>
      <video
        ref={refB}
        autoPlay muted loop playsInline
        style={{ ...VIDEO_STYLE, opacity: primary === "B" ? 0.18 : 0 }}
        aria-hidden="true"
      >
        <source src="/videos/ambient-bg.mp4" type="video/mp4" />
      </video>
    </>
  );
}
