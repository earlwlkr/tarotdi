"use client";

import { useEffect, useState } from "react";

import { formatReadingDate, getDailyReading } from "@/lib/daily-reading";
import { getMeaningParagraphs, type DailyReading } from "@/lib/tarot";
import { TarotCardFace } from "@/components/tarot-card";

type DailyReadingProps = {
  reading: DailyReading;
  formattedDate: string;
};

const SHUFFLE_DURATION_MS = 1600;

export function DailyReadingExperience({ reading, formattedDate }: DailyReadingProps) {
  const [currentReading, setCurrentReading] = useState(reading);
  const [currentFormattedDate, setCurrentFormattedDate] = useState(formattedDate);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const activeKeywords = currentReading.isReversed ? currentReading.card.reversedKeywords : currentReading.card.uprightKeywords;
  const meaningParagraphs = getMeaningParagraphs(currentReading.card, currentReading.isReversed);

  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      const localReading = getDailyReading(new Date());
      setCurrentReading(localReading);
      setCurrentFormattedDate(formatReadingDate(localReading.dateKey));
    }, 0);

    return () => window.clearTimeout(syncTimer);
  }, []);

  useEffect(() => {
    if (!isShuffling) {
      return;
    }

    const revealTimer = window.setTimeout(() => {
      setIsRevealed(true);
      setIsShuffling(false);
    }, SHUFFLE_DURATION_MS);

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
    const shareUrl = `${window.location.origin}/reading/${currentReading.slug}`;
    const message = `${currentFormattedDate}: ${currentReading.card.name} ${currentReading.isReversed ? "(Reversed)" : "(Upright)"}\n${currentReading.isReversed ? currentReading.card.reversedMeaning : currentReading.card.uprightMeaning}`;

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
          <span>{currentFormattedDate}</span>
          {isRevealed ? <span>{currentReading.card.arcana}</span> : null}
          {isRevealed ? <span>{currentReading.isReversed ? "Reversed draw" : "Upright draw"}</span> : null}
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
            <strong>{isRevealed ? currentReading.card.name : "Hidden until reveal"}</strong>
            <p>{isRevealed ? currentReading.card.suit : "Shuffle the deck to uncover the draw."}</p>
          </div>
          <div>
            <p className="reading-panel__label">When revealed</p>
            <strong>{isRevealed ? "Interpret the message" : "Take one breath"}</strong>
            <p>{isRevealed ? "Let the card set the tone before acting on it." : "Pause before shuffling to sharpen the draw."}</p>
          </div>
        </div>
      </section>

      <section className={`stage ${isShuffling ? "is-shuffling" : ""}`}>
        <div className="stage__glow" />
        <div className={`deck ${isShuffling ? "is-shuffling" : ""} ${isRevealed ? "is-hidden" : ""}`}>
          <span className="deck__card deck__card--one" />
          <span className="deck__card deck__card--two" />
          <span className="deck__card deck__card--three" />
        </div>

        <TarotCardFace card={currentReading.card} isReversed={currentReading.isReversed} revealed={isRevealed} />
      </section>

      <section className={`reading-panel ${isRevealed ? "is-visible" : ""}`}>
        <p className="reading-panel__label">Reading</p>
        <h3>{currentReading.card.name}</h3>
        <p className="reading-panel__label">Key themes</p>
        <ul className="meaning-tags" aria-label="Key themes">
          {activeKeywords.map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
        </ul>
        <p className="reading-panel__label">Reflection</p>
        <p>{currentReading.card.reflection}</p>
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
