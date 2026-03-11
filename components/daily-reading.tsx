"use client";

import { useEffect, useMemo, useState } from "react";

import type { DailyReading } from "@/lib/tarot";
import { TarotCardFace } from "@/components/tarot-card";

type DailyReadingProps = {
  reading: DailyReading;
  formattedDate: string;
};

export function DailyReadingExperience({ reading, formattedDate }: DailyReadingProps) {
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/reading/${reading.slug}`;
  }, [reading.slug]);

  useEffect(() => {
    if (!isShuffling) {
      return;
    }

    const revealTimer = window.setTimeout(() => {
      setIsRevealed(true);
      setIsShuffling(false);
    }, 1800);

    return () => window.clearTimeout(revealTimer);
  }, [isShuffling]);

  useEffect(() => {
    if (shareState !== "copied") {
      return;
    }

    const resetTimer = window.setTimeout(() => setShareState("idle"), 1800);
    return () => window.clearTimeout(resetTimer);
  }, [shareState]);

  function handleShuffle() {
    setIsRevealed(false);
    setIsShuffling(true);
  }

  async function handleShare() {
    const message = `${formattedDate}: ${reading.card.name} ${reading.isReversed ? "(Reversed)" : "(Upright)"}\n${reading.isReversed ? reading.card.reversedMeaning : reading.card.uprightMeaning}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Tarot of the Day",
          text: message,
          url: shareUrl
        });
        return;
      } catch {
        // Fall through to clipboard.
      }
    }

    await navigator.clipboard.writeText(`${message}\n${shareUrl}`);
    setShareState("copied");
  }

  return (
    <div className="experience">
      <section className="hero-copy">
        <p className="eyebrow">Daily divination</p>
        <h1>Tarot of the Day</h1>
        <p className="lede">
          A single card for the atmosphere of the day. Shuffle the deck, reveal the draw, and share a link to the reading.
        </p>
        <div className="hero-meta">
          <span>{formattedDate}</span>
          <span>{reading.card.arcana}</span>
        </div>
        <div className="hero-actions">
          <button className="button button--primary" onClick={handleShuffle} type="button" disabled={isShuffling}>
            {isShuffling ? "Shuffling..." : isRevealed ? "Shuffle Again" : "Shuffle the Deck"}
          </button>
          <button className="button button--ghost" onClick={handleShare} type="button" disabled={!isRevealed}>
            {shareState === "copied" ? "Copied Link" : "Share Reading"}
          </button>
        </div>
      </section>

      <section className="stage">
        <div className={`deck ${isShuffling ? "is-shuffling" : ""} ${isRevealed ? "is-hidden" : ""}`}>
          <span className="deck__card deck__card--one" />
          <span className="deck__card deck__card--two" />
          <span className="deck__card deck__card--three" />
        </div>

        <TarotCardFace card={reading.card} isReversed={reading.isReversed} revealed={isRevealed} />
      </section>

      <section className={`reading-panel ${isRevealed ? "is-visible" : ""}`}>
        <div>
          <p className="reading-panel__label">Meaning</p>
          <h3>{reading.card.name}</h3>
          <p>{reading.isReversed ? reading.card.reversedMeaning : reading.card.uprightMeaning}</p>
        </div>
        <div>
          <p className="reading-panel__label">Reflection</p>
          <p>{reading.card.reflection}</p>
        </div>
      </section>
    </div>
  );
}
