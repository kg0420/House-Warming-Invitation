/* ==========================================================================
   THE GUPTA FAMILY — SATYANARAYAN MAHAPOOJA INVITATION
   Cinematic Reel-Inspired Experience & Sacred Ritual Music System
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const scene = document.getElementById("home");
  const enterButton = document.getElementById("enterHome");
  const replayButton = document.getElementById("replayBtn");
  const titleReveal = document.getElementById("titleReveal");
  const padukaSteps = document.querySelectorAll(".paduka-step");
  const petalLayer = document.getElementById("petalLayer");
  const toastBubble = document.getElementById("toastBubble");

  // Ritual Music Player Elements
  const ritualPlayer = document.getElementById("ritualPlayer");
  const playerToggleBtn = document.getElementById("playerToggleBtn");
  const ritualAudio = document.getElementById("ritualAudio");

  let sequenceStarted = false;
  let activeTimeouts = [];

  // ==========================================================================
  // 1. SACRED DEVOTIONAL RITUAL MUSIC SYSTEM
  // Includes: Shankh Naad + Temple Ghanta + Bansuri Flute Devotional Hymn
  // ("Om Namo Bhagavate Vasudevaya") + Tanpura Sacred Resonance
  // ==========================================================================
  let audioCtx = null;
  let isMusicPlaying = false;
  let synthSource = null;
  let synthGain = null;
  let ritualBuffer = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  // Synthesizes the Sacred Pooja Ritual Symphony directly in memory
  function buildDevotionalBuffer(ctx) {
    const sampleRate = ctx.sampleRate || 22050;
    const duration = 24.0; // 24-second devotional ritual loop
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);

    // 1. Tanpura Sa-Pa Sacred Drone (136.1 Hz Om fundamental)
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const env = 0.12 + 0.04 * Math.sin(2 * Math.PI * 0.1 * t);
      data[i] += (
        0.50 * Math.sin(2 * Math.PI * 136.1 * t) +
        0.25 * Math.sin(2 * Math.PI * 204.15 * t + 0.3) +
        0.15 * Math.sin(2 * Math.PI * 272.2 * t + 0.6)
      ) * env * 0.35;
    }

    // 2. Sacred Shankh Naad (Divine Conch blowing at opening: 0.0s - 4.2s)
    const shankhSamples = Math.floor(sampleRate * 4.2);
    for (let i = 0; i < shankhSamples; i++) {
      const t = i / sampleRate;
      let env = 0;
      if (t < 1.0) env = Math.sin((t / 1.0) * (Math.PI / 2));
      else if (t < 3.2) env = 1.0 + 0.08 * Math.sin(2 * Math.PI * 4.5 * t);
      else env = Math.cos(((t - 3.2) / 1.0) * (Math.PI / 2));

      const pitch = 216.0 + 4.0 * Math.sin(Math.PI * (t / 4.2));
      const s = (
        0.50 * Math.sin(2 * Math.PI * pitch * t) +
        0.30 * Math.sin(2 * Math.PI * pitch * 2 * t) +
        0.15 * Math.sin(2 * Math.PI * pitch * 3 * t)
      );
      data[i] += s * env * 0.42;
    }

    // 3. Temple Brass Bells (Ghanta Naad) Struck rhythmically
    const bellStrikes = [0.4, 4.2, 8.5, 12.8, 17.0, 21.2];
    bellStrikes.forEach((bt) => {
      const startIdx = Math.floor(bt * sampleRate);
      const bellLen = Math.floor(3.5 * sampleRate);
      for (let j = 0; j < bellLen; j++) {
        const idx = startIdx + j;
        if (idx >= numSamples) break;
        const t = j / sampleRate;
        const decay = Math.exp(-t * 2.2);
        const b = (
          0.40 * Math.sin(2 * Math.PI * 528.0 * t) +
          0.28 * Math.sin(2 * Math.PI * 1056.0 * t) +
          0.20 * Math.sin(2 * Math.PI * 1584.0 * t)
        );
        data[idx] += b * decay * 0.35;
      }
    });

    // 4. Sacred Bansuri (Flute) Playing "Om Namo Bhagavate Vasudevaya" Melody
    const melody = [
      [4.5, 1.4, 272.2],   // Om
      [6.0, 1.2, 340.25],  // Na-
      [7.3, 1.3, 408.3],   // mo
      [8.8, 1.2, 453.7],   // Bha-
      [10.1, 1.4, 544.4],  // ga-
      [11.6, 1.2, 453.7],  // va-
      [12.9, 1.4, 408.3],  // te
      [14.4, 1.5, 340.25], // Va-
      [16.0, 1.3, 306.2],  // su-
      [17.4, 1.6, 272.2],  // de-
      [19.2, 2.5, 272.2]   // vaya
    ];

    melody.forEach(([st, dur, freq]) => {
      const startIdx = Math.floor(st * sampleRate);
      const noteLen = Math.floor(dur * sampleRate);
      for (let j = 0; j < noteLen; j++) {
        const idx = startIdx + j;
        if (idx >= numSamples) break;
        const t = j / sampleRate;
        let env = 1.0;
        if (t < 0.15) env = t / 0.15;
        else if (t > dur - 0.25) env = (dur - t) / 0.25;

        const vibrato = 1.0 + 0.012 * Math.sin(2 * Math.PI * 5.0 * t);
        const f = freq * vibrato;
        const flute = (
          0.75 * Math.sin(2 * Math.PI * f * t) +
          0.18 * Math.sin(2 * Math.PI * f * 2 * t) +
          0.07 * Math.sin(2 * Math.PI * f * 3 * t)
        );
        data[idx] += flute * env * 0.32;
      }
    });

    // Normalize to 88% full-scale
    let maxVal = 0;
    for (let i = 0; i < numSamples; i++) {
      const v = Math.abs(data[i]);
      if (v > maxVal) maxVal = v;
    }
    if (maxVal > 0) {
      const scale = 0.88 / maxVal;
      for (let i = 0; i < numSamples; i++) {
        data[i] *= scale;
      }
    }

    return buffer;
  }

  function startDevotionalMusic() {
    initAudioContext();

    // If an HTML5 audio element with an accessible track exists, try playing it
    if (ritualAudio && ritualAudio.currentSrc) {
      ritualAudio.play().then(() => {
        isMusicPlaying = true;
        ritualPlayer?.classList.add("is-playing");
        return;
      }).catch(() => {
        // Fallback to Web Audio API synthesis
        playSynthesizedDevotionalTrack();
      });
    } else {
      playSynthesizedDevotionalTrack();
    }
  }

  function playSynthesizedDevotionalTrack() {
    if (!audioCtx) initAudioContext();
    if (!audioCtx) return;

    if (!ritualBuffer) {
      ritualBuffer = buildDevotionalBuffer(audioCtx);
    }

    if (synthSource) {
      try { synthSource.stop(); } catch (e) {}
    }

    synthSource = audioCtx.createBufferSource();
    synthSource.buffer = ritualBuffer;
    synthSource.loop = true;

    synthGain = audioCtx.createGain();
    synthGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    synthGain.gain.linearRampToValueAtTime(0.65, audioCtx.currentTime + 1.2);

    synthSource.connect(synthGain);
    synthGain.connect(audioCtx.destination);
    synthSource.start();

    isMusicPlaying = true;
    ritualPlayer?.classList.add("is-playing");
  }

  function pauseDevotionalMusic() {
    if (ritualAudio && !ritualAudio.paused) {
      ritualAudio.pause();
    }
    if (synthGain && audioCtx) {
      try {
        synthGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
        setTimeout(() => {
          if (synthSource) {
            try { synthSource.stop(); } catch (e) {}
            synthSource = null;
          }
        }, 550);
      } catch (e) {}
    }
    isMusicPlaying = false;
    ritualPlayer?.classList.remove("is-playing");
  }

  function toggleDevotionalMusic() {
    initAudioContext();
    if (!isMusicPlaying) {
      startDevotionalMusic();
      showToast("Playing ritual hymn: ॥ ॐ नमो भगवते वासुदेवाय ॥ 🪔");
    } else {
      pauseDevotionalMusic();
      showToast("Ritual music paused ⏸");
    }
  }

  ritualPlayer?.addEventListener("click", toggleDevotionalMusic);
  playerToggleBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDevotionalMusic();
  });

  // ==========================================================================
  // 2. MAJESTIC CINEMATIC SEQUENCE (~3.8 SECONDS)
  // Stage 1: Door Opens slowly & majestically (2.3s transition) + Sacred Shankh & Hymn
  // Stage 2: Threshold Lotus Bloom & Divine Blessing Hand (1.8s) + Petal Shower
  // Stage 3: Grand Royal Title Reveal (3.8s)
  // ==========================================================================
  function startOpeningSequence() {
    if (sequenceStarted) return;
    sequenceStarted = true;

    // Start devotional ritual music immediately on the user tap
    startDevotionalMusic();

    // Stage 1: Gate opens slowly and gracefully (2.3s transition)
    scene.classList.add("opened");
    if (enterButton) enterButton.disabled = true;

    // Stage 2: Divine Blessing Hand & Petal Shower flows in
    schedule(() => {
      scene.classList.add("blessing-show");
      petalLayer?.classList.add("petals-active");
    }, 1800);

    // Stage 3: Grand Royal Title Reveal emerges smoothly
    schedule(() => {
      scene.classList.add("title-shown");
      titleReveal?.setAttribute("aria-hidden", "false");
    }, 3800);
  }

  function resetOpeningSequence() {
    clearTimeouts();
    sequenceStarted = false;
    scene.classList.remove("opened", "blessing-show", "title-shown");
    petalLayer?.classList.remove("petals-active");
    if (enterButton) enterButton.disabled = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function schedule(fn, ms) {
    const id = window.setTimeout(fn, ms);
    activeTimeouts.push(id);
    return id;
  }

  function clearTimeouts() {
    activeTimeouts.forEach((id) => window.clearTimeout(id));
    activeTimeouts = [];
  }

  enterButton?.addEventListener("click", startOpeningSequence);
  replayButton?.addEventListener("click", resetOpeningSequence);

  // ==========================================================================
  // 3. CANVAS GOLDEN SPARKS PARTICLES
  // ==========================================================================
  const canvas = document.getElementById("sparkleCanvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(32, Math.floor(w / 40));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.6,
        sy: -(Math.random() * 0.5 + 0.15),
        sx: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.5 + 0.2
      });
    }

    let isRunning = true;
    document.addEventListener("visibilitychange", () => {
      isRunning = !document.hidden;
      if (isRunning) requestAnimationFrame(render);
    });

    function render() {
      if (!isRunning) return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y += p.sy;
        p.x += p.sx;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 215, 127, ${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  // ==========================================================================
  // 4. LIVE COUNTDOWN TIMER
  // ==========================================================================
  const countdown = document.getElementById("countdown");
  const eventDate = countdown?.dataset.date ? new Date(countdown.dataset.date) : null;
  const countdownNote = document.getElementById("countdownNote");

  if (eventDate && !Number.isNaN(eventDate.getTime())) {
    const updateCountdown = () => {
      const remaining = eventDate.getTime() - Date.now();
      if (remaining <= 0) {
        ["days", "hours", "minutes", "seconds"].forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.textContent = "00";
        });
        if (countdownNote) {
          countdownNote.textContent = "The auspicious day has arrived! We eagerly look forward to welcoming you.";
        }
        return;
      }
      const vals = {
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000)
      };
      Object.entries(vals).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(val).padStart(2, "0");
      });
    };
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }

  // ==========================================================================
  // 5. GUEST COUNTER (+ / -)
  // ==========================================================================
  const guestCount = document.getElementById("guestCount");
  const guestPlus = document.getElementById("guestPlus");
  const guestMinus = document.getElementById("guestMinus");

  guestPlus?.addEventListener("click", () => {
    if (!guestCount) return;
    let n = parseInt(guestCount.value, 10) || 1;
    if (n < 30) guestCount.value = n + 1;
  });

  guestMinus?.addEventListener("click", () => {
    if (!guestCount) return;
    let n = parseInt(guestCount.value, 10) || 1;
    if (n > 1) guestCount.value = n - 1;
  });

  // ==========================================================================
  // 6. ADD TO CALENDAR & COPY ACTIONS
  // ==========================================================================
  document.getElementById("calendarBtn")?.addEventListener("click", () => {
    const title = encodeURIComponent("Satyanarayan Mahapooja | The Gupta Family");
    const details = encodeURIComponent("Satyanarayan Mahapooja & Griha Pravesh Celebration with The Gupta Family.\n\nDate: Sunday, 20 December 2026\nTime: 09:00 AM – 05:00 PM\nVenue: Bypaas Ayodhya Building, 14th Floor, Bhiwandi.");
    const location = encodeURIComponent("Bypaas Ayodhya Building, 14th Floor, Bhiwandi, Maharashtra");
    const start = "20261220T033000Z";
    const end = "20261220T113000Z";

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(url, "_blank", "noopener,noreferrer");
    showToast("Opening calendar invitation 📅");
  });

  document.getElementById("copyAddressBtn")?.addEventListener("click", async () => {
    const text = document.getElementById("venueAddress")?.textContent || "Bypaas Ayodhya Building, 14th Floor, Bhiwandi, Maharashtra";
    try {
      await navigator.clipboard.writeText(text);
      showToast("Venue address copied! 📋");
    } catch (e) {
      window.prompt("Venue address:", text);
    }
  });

  function showToast(msg) {
    if (!toastBubble) return;
    toastBubble.textContent = msg;
    toastBubble.classList.add("toast-open");
    window.clearTimeout(toastBubble.dataset.timer);
    toastBubble.dataset.timer = window.setTimeout(() => {
      toastBubble.classList.remove("toast-open");
    }, 2800);
  }

  // ==========================================================================
  // 7. SHARE INVITATION
  // ==========================================================================
  document.getElementById("shareButton")?.addEventListener("click", async () => {
    const data = {
      title: "Satyanarayan Mahapooja | The Gupta Family",
      text: "You are warmly invited to the Satyanarayan Mahapooja and celebration of our new home on Sunday, 20 December 2026 in Bhiwandi.",
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (e) {}
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Invitation link copied! ✓");
    } catch (e) {
      window.prompt("Share your invitation link:", window.location.href);
    }
  });

  // ==========================================================================
  // 8. SCROLL REVEALS
  // ==========================================================================
  const revealTargets = document.querySelectorAll(
    ".paper-frame, .section-heading, .event-art, .event-card, .countdown-wrap, .schedule-list article, .blessing-section > *, .rsvp-form, .share-actions"
  );
  revealTargets.forEach((el, index) => {
    el.classList.add("scroll-reveal");
    el.style.transitionDelay = `${(index % 4) * 80}ms`;
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }
});
