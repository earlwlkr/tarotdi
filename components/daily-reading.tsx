"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { formatReadingDate, getDailyReading } from "@/lib/daily-reading";
import {
  getMeaningParagraphs,
  makeReadingSlug,
  type TarotReading,
  type CardDraw,
  type SpreadType
} from "@/lib/tarot";
import { TarotCardFace } from "@/components/tarot-card";
import { tarotCards } from "@/data/tarot-cards";

// --- PROCEDURAL MYSTICAL SOUND SYNTHESIZER ---
class MysticalAudioSynth {
  private ctx: AudioContext | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneLfo: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  public isMuted: boolean = true;

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  playDrone() {
    this.init();
    if (!this.ctx) return;
    if (this.droneOsc1) return;

    try {
      // Re-enable context if suspended (common browser security behavior)
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneLfo = this.ctx.createOscillator();
      
      const gain1 = this.ctx.createGain();
      const gain2 = this.ctx.createGain();
      const lfoGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);

      // Low mystical Eb2 chord tones for spiritual focus
      this.droneOsc1.type = "sawtooth";
      this.droneOsc1.frequency.setValueAtTime(77.78, this.ctx.currentTime); // Eb2

      this.droneOsc2.type = "triangle";
      this.droneOsc2.frequency.setValueAtTime(116.54, this.ctx.currentTime); // Bb2 (fifth above)

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, this.ctx.currentTime);
      filter.Q.setValueAtTime(4, this.ctx.currentTime);

      // LFO for breathing filter cutoff modulation
      this.droneLfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // very slow (12.5s cycle)
      lfoGain.gain.setValueAtTime(40, this.ctx.currentTime);

      // Connections
      this.droneLfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      gain1.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain2.gain.setValueAtTime(0.1, this.ctx.currentTime);

      this.droneOsc1.connect(gain1);
      this.droneOsc2.connect(gain2);

      gain1.connect(filter);
      gain2.connect(filter);

      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.droneLfo.start();

      this.droneGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 3.0);
    } catch (e) {
      console.error("Failed to start drone soundscape", e);
    }
  }

  stopDrone() {
    if (!this.ctx || !this.droneGain) return;
    try {
      const currentVal = this.droneGain.gain.value;
      this.droneGain.gain.setValueAtTime(currentVal, this.ctx.currentTime);
      this.droneGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.2);

      const osc1 = this.droneOsc1;
      const osc2 = this.droneOsc2;
      const lfo = this.droneLfo;

      setTimeout(() => {
        try {
          osc1?.stop();
          osc2?.stop();
          lfo?.stop();
        } catch {}
      }, 1300);

      this.droneOsc1 = null;
      this.droneOsc2 = null;
      this.droneLfo = null;
    } catch (e) {
      console.warn(e);
    }
  }

  playCardSweep() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.12; // 120ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(1600, this.ctx.currentTime);

      const sweepGain = this.ctx.createGain();
      sweepGain.gain.setValueAtTime(0.012, this.ctx.currentTime);
      sweepGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);

      noise.connect(filter);
      filter.connect(sweepGain);
      sweepGain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      console.warn(e);
    }
  }

  playChime() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    try {
      // Ethereal chime chord harmonics (Bell series)
      const frequencies = [220, 440, 554.37, 659.25, 880];
      const gains = [0.12, 0.08, 0.06, 0.04, 0.02];
      const decayTimes = [2.0, 1.4, 1.2, 0.9, 0.6];

      const filter = this.ctx.createBiquadFilter();
      filter.type = "peaking";
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);
      filter.gain.setValueAtTime(3, this.ctx.currentTime);

      const delay = this.ctx.createDelay();
      delay.delayTime.setValueAtTime(0.25, this.ctx.currentTime);

      const delayGain = this.ctx.createGain();
      delayGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

      const outputGain = this.ctx.createGain();
      outputGain.gain.setValueAtTime(0.14, this.ctx.currentTime);

      // Add a shimmering LFO pitch vibrato
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.setValueAtTime(5.8, this.ctx.currentTime);
      vibratoGain.gain.setValueAtTime(2.5, this.ctx.currentTime);
      vibrato.connect(vibratoGain);
      vibrato.start();

      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        vibratoGain.connect(osc.frequency);

        oscGain.gain.setValueAtTime(gains[idx] ?? 0.02, this.ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + (decayTimes[idx] ?? 1.0));

        osc.connect(oscGain);
        oscGain.connect(filter);

        osc.start();
        osc.stop(this.ctx.currentTime + (decayTimes[idx] ?? 1.0) + 0.1);
      });

      filter.connect(outputGain);
      outputGain.connect(this.ctx.destination);

      filter.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(this.ctx.destination);

      vibrato.stop(this.ctx.currentTime + 2.5);
    } catch (e) {
      console.warn(e);
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (mute) {
      this.stopDrone();
    } else {
      this.playDrone();
    }
  }
}

// Instantiate sound synth singleton (client-side only)
const synth = typeof window !== "undefined" ? new MysticalAudioSynth() : null;

type DailyReadingProps = {
  reading: TarotReading;
  formattedDate: string;
};

// Shuffling parameters
const FAN_CARDS_COUNT = 22;
const SHUFFLE_DURATION_MS = 1600;

export function DailyReadingExperience({ reading, formattedDate }: DailyReadingProps) {
  // --- STATE ---
  const [spreadType, setSpreadType] = useState<SpreadType>("daily");
  const [ritualState, setRitualState] = useState<"intro" | "shuffling" | "drawing" | "complete">("intro");
  
  // Drawn cards states
  const [drawnCards, setDrawnCards] = useState<(CardDraw & { revealed: boolean })[]>([]);
  const [activeDrawnIndex, setActiveDrawnIndex] = useState<number | null>(null);
  const [drawnFanIndices, setDrawnFanIndices] = useState<number[]>([]);
  
  // Audio state
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  
  // Journal states
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [journalEntries, setJournalEntries] = useState<TarotReading[]>([]);
  const [notesText, setNotesText] = useState("");
  const [isSavedInJournal, setIsSavedInJournal] = useState(false);
  
  // Share state
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  const [currentReading, setCurrentReading] = useState(reading);
  const [currentFormattedDate, setCurrentFormattedDate] = useState(formattedDate);

  const revealedCardRef = useRef<HTMLElement>(null);
  const soundInitialized = useRef(false);

  // Sync date on load
  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      const localReading = getDailyReading(new Date());
      setCurrentReading(localReading);
      setCurrentFormattedDate(formatReadingDate(localReading.dateKey));
    }, 0);

    // Load Journal
    const stored = localStorage.getItem("tarotdi_journal");
    if (stored) {
      try {
        setJournalEntries(JSON.parse(stored));
      } catch (e) {
        console.warn("Failed to load journal", e);
      }
    }

    return () => {
      window.clearTimeout(syncTimer);
      if (synth) synth.stopDrone();
    };
  }, []);

  // Mute effect sync
  useEffect(() => {
    if (synth) {
      synth.setMute(isAudioMuted);
    }
  }, [isAudioMuted]);

  // Reset sharing copied text
  useEffect(() => {
    if (shareState !== "copied") return;
    const resetTimer = window.setTimeout(() => setShareState("idle"), 1800);
    return () => window.clearTimeout(resetTimer);
  }, [shareState]);

  // Audio trigger utility
  function triggerAudioHover() {
    if (synth && !isAudioMuted) synth.playCardSweep();
  }

  // --- RITUAL HANDLERS ---
  function handleSelectSpread(type: SpreadType) {
    if (ritualState === "shuffling" || ritualState === "drawing") return;
    setSpreadType(type);
    setRitualState("intro");
    setDrawnCards([]);
    setDrawnFanIndices([]);
    setIsSavedInJournal(false);
    setNotesText("");
  }

  function handleStartRitual() {
    setRitualState("shuffling");
    setDrawnCards([]);
    setDrawnFanIndices([]);
    setIsSavedInJournal(false);
    setNotesText("");

    if (!soundInitialized.current) {
      setIsAudioMuted(false);
      soundInitialized.current = true;
    } else if (synth && !isAudioMuted) {
      synth.playDrone();
    }

    // Play card friction sweeps during shuffle
    let sweeps = 0;
    const sweepInterval = setInterval(() => {
      if (synth && !isAudioMuted) synth.playCardSweep();
      sweeps++;
      if (sweeps >= 6) clearInterval(sweepInterval);
    }, 250);

    setTimeout(() => {
      setRitualState("drawing");
    }, SHUFFLE_DURATION_MS);
  }

  // Card Draw Handler
  function handleDrawCard(fanIndex: number) {
    if (ritualState !== "drawing") return;
    if (drawnFanIndices.includes(fanIndex)) return;

    const maxCards = spreadType === "daily" ? 1 : spreadType === "three-card" ? 3 : 2;
    if (drawnFanIndices.length >= maxCards) return;

    // Play drawing chime
    if (synth && !isAudioMuted) {
      synth.playChime();
    }

    // Draw card at random from deck data
    const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    const isReversed = Math.random() > 0.5;

    let slotLabel = undefined;
    if (spreadType === "three-card") {
      const labels = ["Past", "Present", "Future"];
      slotLabel = labels[drawnCards.length];
    } else if (spreadType === "choices") {
      const labels = ["Crossroads & Obstacle", "Opportunity & Action"];
      slotLabel = labels[drawnCards.length];
    }

    const newDraw: CardDraw & { revealed: boolean } = {
      card: randomCard,
      isReversed,
      slotLabel,
      revealed: false
    };

    const nextDrawnIndices = [...drawnFanIndices, fanIndex];
    const nextDrawnCards = [...drawnCards, newDraw];

    setDrawnFanIndices(nextDrawnIndices);
    setDrawnCards(nextDrawnCards);

    // If drew all required cards, end drawing
    if (nextDrawnIndices.length === maxCards) {
      setTimeout(() => {
        setRitualState("complete");
        // Auto select first slot for details display
        setActiveDrawnIndex(0);
      }, 700);
    }
  }

  // Card Flip Reveal Handler
  function handleFlipReveal(slotIdx: number) {
    if (ritualState !== "complete") return;
    if (drawnCards[slotIdx].revealed) {
      setActiveDrawnIndex(slotIdx);
      return;
    }

    // Play celestial gong
    if (synth && !isAudioMuted) {
      synth.playChime();
    }

    const updated = [...drawnCards];
    updated[slotIdx].revealed = true;
    setDrawnCards(updated);
    setActiveDrawnIndex(slotIdx);

    // Center revealed card in viewport on mobile
    setTimeout(() => {
      if (revealedCardRef.current) {
        revealedCardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  }

  // --- SHARING ---
  async function handleShare() {
    const isAllRevealed = drawnCards.every((c) => c.revealed);
    if (!isAllRevealed) return;

    const finalSlug = makeReadingSlug(currentReading.dateKey, spreadType, drawnCards);
    const shareUrl = `${window.location.origin}/reading/${finalSlug}`;
    
    // Build descriptive share message
    let message = `Daily Tarot Divination - ${currentFormattedDate}\n`;
    if (spreadType === "daily") {
      message += `Draw: ${drawnCards[0].card.name} (${drawnCards[0].isReversed ? "Reversed" : "Upright"})\n`;
    } else {
      message += `${spreadType === "three-card" ? "Three-Card Spread" : "Path of Choices Spread"}:\n`;
      drawnCards.forEach((d) => {
        message += `- ${d.slotLabel}: ${d.card.name} (${d.isReversed ? "Reversed" : "Upright"})\n`;
      });
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Tarot Ritual",
          text: message,
          url: shareUrl
        });
        return;
      } catch {
        // Fall back to clipboard
      }
    }

    await navigator.clipboard.writeText(`${message}\n${shareUrl}`);
    setShareState("copied");
  }

  // --- JOURNAL ---
  function handleSaveJournal() {
    if (drawnCards.length === 0 || isSavedInJournal) return;

    const newReadingEntry: TarotReading = {
      spread: spreadType,
      draws: drawnCards.map((c) => ({
        card: c.card,
        isReversed: c.isReversed,
        slotLabel: c.slotLabel
      })),
      dateKey: currentReading.dateKey,
      slug: makeReadingSlug(currentReading.dateKey, spreadType, drawnCards),
      notes: notesText.trim() ? notesText.trim() : undefined
    };

    const nextEntries = [newReadingEntry, ...journalEntries];
    setJournalEntries(nextEntries);
    localStorage.setItem("tarotdi_journal", JSON.stringify(nextEntries));
    setIsSavedInJournal(true);
  }

  function handleClearJournal() {
    if (confirm("Are you sure you want to clear your entire divination history?")) {
      setJournalEntries([]);
      localStorage.removeItem("tarotdi_journal");
    }
  }

  // --- MEANING SELECTORS ---
  const activeDraw = activeDrawnIndex !== null ? drawnCards[activeDrawnIndex] : null;
  const activeKeywords = activeDraw
    ? activeDraw.isReversed
      ? activeDraw.card.reversedKeywords
      : activeDraw.card.uprightKeywords
    : [];
  const meaningParagraphs = activeDraw ? getMeaningParagraphs(activeDraw.card, activeDraw.isReversed) : [];

  // Card Draw requirements count
  const drawTargetCount = spreadType === "daily" ? 1 : spreadType === "three-card" ? 3 : 2;
  const drawRemaining = drawTargetCount - drawnFanIndices.length;

  return (
    <div className="experience" style={{ gridTemplateColumns: "1fr" }}>
      {/* Mystical Sound Controller overlay */}
      <div className="audio-controller" aria-label="Audio controls">
        <button
          className="audio-btn"
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          type="button"
          title={isAudioMuted ? "Unmute soundscape" : "Mute soundscape"}
        >
          {isAudioMuted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <div className={`equalizer ${!isAudioMuted ? "is-active" : ""}`}>
          <div className="equalizer-bar" />
          <div className="equalizer-bar" />
          <div className="equalizer-bar" />
          <div className="equalizer-bar" />
        </div>
      </div>

      {/* Divination Journal Trigger */}
      <button className="journal-trigger" onClick={() => setIsJournalOpen(true)} type="button">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        <span>Journal</span>
      </button>

      {/* Main Altar Screen Container */}
      <div style={{ maxWidth: "1140px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "40px" }}>
        
        {/* Intro Hero Box */}
        <section className="hero-copy" style={{ textAlign: "center", paddingBottom: "36px" }}>
          <p className="eyebrow">Interactive Divination</p>
          <h1 style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)" }}>The Ritual Altar</h1>
          
          <p className="lede" style={{ margin: "16px auto 32px", maxWidth: "42rem" }}>
            Align your intent, choose your sacred spread, and interactively draw your cards from the fanned deck to begin the ritual.
          </p>

          {/* Symmetrical Spread Selection Tabs */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="ritual-selector" role="tablist">
              <button
                className={`ritual-tab ${spreadType === "daily" ? "is-active" : ""}`}
                onClick={() => handleSelectSpread("daily")}
                type="button"
                role="tab"
                aria-selected={spreadType === "daily"}
              >
                Daily Draw
              </button>
              <button
                className={`ritual-tab ${spreadType === "three-card" ? "is-active" : ""}`}
                onClick={() => handleSelectSpread("three-card")}
                type="button"
                role="tab"
                aria-selected={spreadType === "three-card"}
              >
                Timeline
              </button>
              <button
                className={`ritual-tab ${spreadType === "choices" ? "is-active" : ""}`}
                onClick={() => handleSelectSpread("choices")}
                type="button"
                role="tab"
                aria-selected={spreadType === "choices"}
              >
                Crossroads
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "12px" }}>
            <span>{currentFormattedDate}</span>
          </div>
        </section>

        {/* 3D Dynamic Ritual Stage */}
        <section className="hero-copy" style={{ padding: "40px 24px", minHeight: "560px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
          
          {/* INTRO: Shuffle Action */}
          {ritualState === "intro" && (
            <div style={{ textAlign: "center", zIndex: 10, width: "100%" }}>
              <div className="stage__glow" style={{ position: "relative", margin: "0 auto", transform: "none", filter: "blur(40px)", opacity: 0.6 }} />
              <div className="intro-deck-stack">
                <span className="intro-deck-card intro-deck-card--one" />
                <span className="intro-deck-card intro-deck-card--two" />
                <span className="intro-deck-card intro-deck-card--three" />
              </div>
              <button className="button button--primary" onClick={handleStartRitual} type="button">
                Shuffle & Begin Spread
              </button>
            </div>
          )}

          {/* SHUFFLING: Animated Swaying Deck Stack */}
          {ritualState === "shuffling" && (
            <div className="stage is-shuffling" style={{ width: "100%" }}>
              <div className="stage__glow" />
              <div className="mystical-shuffle-deck">
                {Array.from({ length: 8 }).map((_, idx) => {
                  const angleRad = (idx * 45 * Math.PI) / 180;
                  const cosVal = Math.cos(angleRad).toFixed(4);
                  const sinVal = Math.sin(angleRad).toFixed(4);
                  return (
                    <div
                      key={idx}
                      className="mystical-shuffle-card"
                      style={
                        {
                          ["--card-idx" as string]: idx,
                          ["--cos-val" as string]: cosVal,
                          ["--sin-val" as string]: sinVal,
                          animationDelay: `${idx * 0.08}s`
                        } as CSSProperties
                      }
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* DRAWING: Beautiful Fan Layout to Click-Draw Cards */}
          {ritualState === "drawing" && (
            <div style={{ width: "100%", zIndex: 10, textAlign: "center" }}>
              <p className="eyebrow" style={{ textShadow: "0 0 10px rgba(229, 184, 105, 0.4)" }}>
                Draw {drawRemaining} more card{drawRemaining > 1 ? "s" : ""}
              </p>
              
              {/* Partially filled Altar deal slots backing */}
              <div className="spread-slots-container" style={{ marginBottom: "20px", transform: "scale(0.85)" }}>
                {Array.from({ length: drawTargetCount }).map((_, idx) => (
                  <div key={idx} className="spread-slot" style={{ width: "150px" }}>
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "0.64",
                        border: "1px dashed rgba(229, 184, 105, 0.2)",
                        borderRadius: "16px",
                        background: "rgba(255, 255, 255, 0.01)",
                        display: "grid",
                        placeItems: "center"
                      }}
                    >
                      {drawnCards[idx] ? (
                        <div className="slot-card-back" />
                      ) : (
                        <span style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Slot {idx + 1}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shuffled fan of cards */}
              <div className="deck-fan-container">
                {Array.from({ length: FAN_CARDS_COUNT }).map((_, idx) => {
                  const angle = (idx - (FAN_CARDS_COUNT - 1) / 2) * 4.2; // curve arc angles
                  const isDrawn = drawnFanIndices.includes(idx);
                  return (
                    <button
                      key={idx}
                      className={`deck-fan-card ${isDrawn ? "is-drawn" : ""}`}
                      onClick={() => handleDrawCard(idx)}
                      onMouseEnter={triggerAudioHover}
                      style={{
                        "--angle": `${angle}deg`,
                        transform: `rotate(${angle}deg) translate(0, -90px)`,
                        zIndex: idx
                      } as CSSProperties}
                      type="button"
                      aria-label={`Draw card ${idx + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* COMPLETE: Reveal Layout */}
          {ritualState === "complete" && (
            <div className="altar-spread-grid">
              <p className="eyebrow" style={{ textAlign: "center" }}>Click cards to flip and reveal their meanings</p>
              
              <div className="spread-slots-container">
                {drawnCards.map((draw, idx) => (
                  <div key={idx} className="spread-slot" onClick={() => handleFlipReveal(idx)}>
                    {draw.slotLabel && <span className="spread-slot-label">{draw.slotLabel}</span>}
                    <div style={{ cursor: "pointer", transition: "transform 200ms ease" }} className={activeDrawnIndex === idx ? "slot-card-active" : ""}>
                      <TarotCardFace
                        ref={activeDrawnIndex === idx ? revealedCardRef : null}
                        card={draw.card}
                        isReversed={draw.isReversed}
                        revealed={draw.revealed}
                        visible={true}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Share actions for complete spread */}
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "24px" }}>
                <button
                  className="button button--ghost"
                  onClick={handleShare}
                  type="button"
                  disabled={!drawnCards.every((c) => c.revealed)}
                >
                  {shareState === "copied" ? "Copied Share Link" : "Share This Spread"}
                </button>
              </div>
            </div>
          )}

        </section>

        {/* Dynamic Detail Readings Panel */}
        {ritualState === "complete" && activeDraw && activeDraw.revealed && (
          <section className="reading-panel is-visible" style={{ gridColumn: "auto" }}>
            <p className="reading-panel__label">{activeDraw.slotLabel ? `${activeDraw.slotLabel} Card` : "Reading"}</p>
            <h3 style={{ fontSize: "2.2rem" }}>{activeDraw.card.name}</h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", marginTop: "28px" }}>
              <div>
                <p className="reading-panel__label">Key themes</p>
                <ul className="meaning-tags" aria-label="Key themes">
                  {activeKeywords.map((keyword) => (
                    <li key={keyword}>{keyword}</li>
                  ))}
                </ul>

                <p className="reading-panel__label" style={{ marginTop: "32px" }}>Reflection</p>
                <p className="share-view__reflection" style={{ marginTop: "12px", borderLeftWidth: "3px" }}>
                  {activeDraw.card.reflection}
                </p>
              </div>

              <div>
                <p className="reading-panel__label">Meaning</p>
                <div className="meaning-copy">
                  {meaningParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Note taking / Journal Saving */}
            {drawnCards.every((c) => c.revealed) && (
              <div className="journal-note-editor">
                <p className="reading-panel__label" style={{ margin: 0, border: "none" }}>Record your thoughts in your journal</p>
                <textarea
                  className="journal-note-textarea"
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="How does this card draw resonate with you today? Jot down any initial feelings, observations, or synchronistic events..."
                  disabled={isSavedInJournal}
                />
                <button
                  className="journal-save-btn"
                  onClick={handleSaveJournal}
                  type="button"
                  disabled={isSavedInJournal}
                  style={isSavedInJournal ? { background: "rgba(255, 255, 255, 0.05)", color: "var(--muted)", cursor: "default", boxShadow: "none" } : {}}
                >
                  {isSavedInJournal ? "Saved in Journal" : "Save Reading to Journal"}
                </button>
              </div>
            )}
          </section>
        )}
      </div>

      {/* --- DIVINATION JOURNAL SLIDE OVER DRAWER --- */}
      <div className={`journal-drawer ${isJournalOpen ? "is-open" : ""}`} onClick={() => setIsJournalOpen(false)}>
        <div className="journal-drawer-content" onClick={(e) => e.stopPropagation()}>
          <div className="journal-drawer-header">
            <h2>Divination Journal</h2>
            <button className="journal-close-btn" onClick={() => setIsJournalOpen(false)} type="button" aria-label="Close Journal">
              &times;
            </button>
          </div>

          <div className="journal-list">
            {journalEntries.length > 0 ? (
              <>
                <button
                  className="button button--ghost"
                  onClick={handleClearJournal}
                  type="button"
                  style={{ width: "100%", padding: "10px", fontSize: "0.72rem", borderStyle: "dashed" }}
                >
                  Clear Divination History
                </button>
                
                {journalEntries.map((entry, idx) => (
                  <article key={idx} className="journal-item">
                    <div className="journal-item-header">
                      <span className="journal-item-date">{entry.dateKey}</span>
                      <span className="journal-item-spread">{entry.spread}</span>
                    </div>

                    <div className="journal-item-cards">
                      {entry.draws.map((d, cIdx) => (
                        <span key={cIdx} className="journal-item-card-badge" style={{ borderColor: d.card.palette.accent }}>
                          {d.slotLabel ? `${d.slotLabel}: ` : ""}
                          <strong>{d.card.name}</strong> {d.isReversed ? "↺" : "↑"}
                        </span>
                      ))}
                    </div>

                    {entry.notes && (
                      <p className="journal-item-notes">{entry.notes}</p>
                    )}
                  </article>
                ))}
              </>
            ) : (
              <div className="journal-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10M6 10h10" />
                </svg>
                <p>Your journal is currently empty.</p>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", maxWidth: "260px" }}>
                  Save your revealed spreads to compile an active chronicle of your spiritual insights.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
