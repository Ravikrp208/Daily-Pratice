// ============================================================
// PREMIUM SMOOTH SCROLL (Awwwards-style, vanilla JS, no libraries)
// How it works:
// - #main (data-smooth-wrapper) is fixed in place via CSS.
// - We let the browser's native scrollbar work as normal on <body>
//   (so scroll position, keyboard, scrollbar-drag all keep working).
// - Every frame we "lerp" (linearly interpolate) the wrapper's
//   translateY toward the real scroll position, which creates the
//   soft lag / inertia feel instead of an instant jump.
// ============================================================
(function initSmoothScroll() {
  const wrapper = document.querySelector("[data-smooth-wrapper]");
  if (!wrapper) return;

  // Lower ease = laggier/softer, higher ease = snappier. 0.08-0.12 feels premium.
  const EASE = 0.09;

  let current = 0;   // where the content visually is right now
  let target = 0;    // where the browser scroll actually is (the real target)
  let rafId = null;

  // Give <body> real height so the native scrollbar reflects the full page length,
  // since #main itself is position:fixed and no longer pushes body height naturally.
  function setBodyHeight() {
    document.body.style.height = wrapper.scrollHeight + "px";
  }

  // Main animation loop: eases "current" toward "target" every frame
  function raf() {
    current += (target - current) * EASE;

    // Snap when the gap is tiny, so it doesn't animate forever / stays crisp
    if (Math.abs(target - current) < 0.05) {
      current = target;
    }

    wrapper.style.transform = `translate3d(0, ${-current}px, 0)`;
    rafId = requestAnimationFrame(raf);
  }

  // Native scroll updates the target instantly; the rAF loop eases toward it
  window.addEventListener(
    "scroll",
    () => {
      target = window.scrollY;
    },
    { passive: true }
  );

  // Recalculate body height on resize (and once media/videos load, sizes can shift)
  window.addEventListener("resize", setBodyHeight);
  window.addEventListener("load", setBodyHeight);

  setBodyHeight();
  raf(); // start the loop
})();



document.addEventListener("DOMContentLoaded", () => {
  // Grab every card that actually contains a video (BMW / Bugati / Lamborgini)
  const cards = document.querySelectorAll(".element");

  cards.forEach((card) => {
    const video = card.querySelector(".element-video");

    // Skip cards that don't have a video (LUCID MOTORS, BARON CAPITAL)
    if (!video) return;

    // Debug helper: if the video file path is wrong / file missing,
    // this logs a clear error in the browser console (F12 > Console)
    video.addEventListener("error", () => {
      console.error(
        `Video failed to load: "${video.currentSrc || video.querySelector("source")?.src}". ` +
        `Check that the .mp4 file is in the same folder as index.html and the filename matches exactly.`
      );
    });

    // How far (in px) the video is allowed to shift while following the cursor
    // (bigger than before since the video is now allowed to spill outside the card)
    const MAX_SHIFT = 22;

    // rAF handle so we only ever have one animation frame queued per card
    let rafId = null;
    let targetX = 0;
    let targetY = 0;

    // -----------------------------
    // Mouse enters the card
    // -----------------------------
    card.addEventListener("mouseenter", () => {
      // Fallback hover class for browsers that don't support the CSS :has() selector
      card.classList.add("is-hovered");

      // Fade the video in and kick off playback right away
      video.classList.add("is-playing"); // fades the video in via CSS opacity
      video.style.opacity = "1"; // fail-safe: force visible even if CSS class/cache is stale

      // Only reset to the start if metadata has actually loaded (readyState >= 1).
      // Setting currentTime before that can throw in some browsers and would
      // stop this handler before it ever reaches video.play().
      const resetAndPlay = () => {
        try {
          video.currentTime = 0;
        } catch (err) {
          console.warn("Could not reset currentTime:", err);
        }
        video.play().catch((err) => {
          // Log the REAL reason playback failed instead of swallowing it silently.
          console.error("video.play() failed:", err.name, err.message);
        });
      };

      if (video.readyState >= 1 /* HAVE_METADATA */) {
        resetAndPlay();
      } else {
        // Wait for metadata (fires once, cleans itself up)
        video.addEventListener("loadedmetadata", resetAndPlay, { once: true });
        // In case metadata never loads (preload="metadata" is just a hint),
        // force the browser to actually start loading now.
        video.load();
      }
    });

    // -----------------------------
    // Mouse moves inside the card -> cursor-follow effect
    // -----------------------------
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();

      // Cursor position relative to the card, normalized from -0.5 to 0.5
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      // Convert to a small pixel offset (max ±MAX_SHIFT px)
      targetX = relX * MAX_SHIFT * 2;
      targetY = relY * MAX_SHIFT * 2;

      // Only queue one rAF update at a time for smooth 60fps movement
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          video.style.transform = `translate(${targetX}px, ${targetY}px) scale(1.02) translateZ(0)`;
          rafId = null;
        });
      }
    });

    // -----------------------------
    // Mouse leaves the card
    // -----------------------------
    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-hovered");

      // Pause and reset the video back to the start
      video.pause();
      video.currentTime = 0;
      video.classList.remove("is-playing"); // fades video back out
      video.style.opacity = "0"; // fail-safe reset to match

      // Smoothly reset the parallax offset back to center
      video.style.transform = "translate(0px, 0px) scale(1.02) translateZ(0)";
    });
  });
});