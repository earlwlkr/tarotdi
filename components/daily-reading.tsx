"use client";

import { useEffect, useState } from "react";

import { getMeaningParagraphs, type DailyReading } from "@/lib/tarot";
import { TarotCardFace } from "@/components/tarot-card";

type DailyReadingProps = {
  reading: DailyReading;
  formattedDate: string;
};

export function DailyReadingExperience({ reading, formattedDate }: DailyReadingProps) {
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const activeKeywords = reading.isReversed ? reading.card.reversedKeywords : reading.card.uprightKeywords;
  const meaningParagraphs = getMeaningParagraphs(reading.card, reading.isReversed);

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
    const shareUrl = `${window.location.origin}/reading/${reading.slug}`;
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
          A single card for the atmosphere of the day. Shuffle the deck, reveal the draw, and sit with a reading built to feel more like ritual than widget.
        </p>
        <div className="hero-meta">
          <span>{formattedDate}</span>
          <span>{reading.card.arcana}</span>
          <span>{reading.isReversed ? "Reversed draw" : "Upright draw"}</span>
        </div>
        <div className="hero-actions">
          <button className="button button--primary" onClick={handleShuffle} type="button" disabled={isShuffling}>
            {isShuffling ? "Shuffling..." : isRevealed ? "Shuffle Again" : "Shuffle the Deck"}
          </button>
          <button className="button button--ghost" onClick={handleShare} type="button" disabled={!isRevealed}>
            {shareState === "copied" ? "Copied Link" : "Share Reading"}
          </button>
        </div>
        <div className="ritual-guide" aria-label="Reading guide">
          <div>
            <p className="reading-panel__label">Card of the day</p>
            <strong>{reading.card.name}</strong>
            <p>{reading.card.suit}</p>
          </div>
          <div>
            <p className="reading-panel__label">When revealed</p>
            <strong>{isRevealed ? "Interpret the message" : "Take one breath"}</strong>
            <p>{isRevealed ? "Let the card set the tone before acting on it." : "Pause before shuffling to sharpen the draw."}</p>
          </div>
        </div>
      </section>

      <section className="stage">
        <div className="stage__glow" />
        <div className={`deck ${isShuffling ? "is-shuffling" : ""} ${isRevealed ? "is-hidden" : ""}`}>
          <span className="deck__card deck__card--one" />
          <span className="deck__card deck__card--two" />
          <span className="deck__card deck__card--three" />
        </div>

        <TarotCardFace card={reading.card} isReversed={reading.isReversed} revealed={isRevealed} />
      </section>

      <section className={`reading-panel ${isRevealed ? "is-visible" : ""}`}>
        <p className="reading-panel__label">Reading</p>
        <h3>{reading.card.name}</h3>
        <p className="reading-panel__label">Key themes</p>
        <ul className="meaning-tags" aria-label="Key themes">
          {activeKeywords.map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
        </ul>
        <p className="reading-panel__label">Reflection</p>
        <p>{reading.card.reflection}</p>
        <p className="reading-panel__label">Meaning</p>
        <div className="meaning-copy">
          {meaningParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
