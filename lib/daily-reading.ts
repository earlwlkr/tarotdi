import { tarotCards } from "@/data/tarot-cards";
import {
  buildDateKey,
  hashString,
  makeReadingSlug,
  type TarotReading,
  type CardDraw,
  type SpreadType
} from "@/lib/tarot";

export function getDailyReading(date = new Date()): TarotReading {
  const dateKey = buildDateKey(date);
  const hash = hashString(dateKey);
  const card = tarotCards[hash % tarotCards.length];
  const isReversed = (hash >> 3) % 2 === 1;

  const draws: CardDraw[] = [{ card, isReversed }];

  return {
    spread: "daily",
    draws,
    dateKey,
    slug: makeReadingSlug(dateKey, "daily", draws)
  };
}

export function getReadingFromSlug(slug: string): TarotReading | null {
  const parts = slug.split("--");
  if (parts.length < 3) {
    return null;
  }

  const dateKey = parts[0];
  const secondPart = parts[1];

  const knownSpreads: SpreadType[] = ["daily", "three-card", "choices"];

  // If the second part is a known spread, decode multi-card format
  if (knownSpreads.includes(secondPart as SpreadType)) {
    const spread = secondPart as SpreadType;
    const draws: CardDraw[] = [];

    for (let i = 2; i < parts.length; i++) {
      const drawPart = parts[i];
      const dashIndex = drawPart.lastIndexOf("-");
      if (dashIndex === -1) {
        return null;
      }

      const cardSlug = drawPart.substring(0, dashIndex);
      const orientation = drawPart.substring(dashIndex + 1);

      if (!["upright", "reversed"].includes(orientation)) {
        return null;
      }

      const card = tarotCards.find((c) => c.slug === cardSlug);
      if (!card) {
        return null;
      }

      let slotLabel: string | undefined = undefined;
      if (spread === "three-card") {
        const labels = ["Past", "Present", "Future"];
        slotLabel = labels[draws.length];
      } else if (spread === "choices") {
        const labels = ["Crossroads & Obstacle", "Opportunity & Action"];
        slotLabel = labels[draws.length];
      }

      draws.push({
        card,
        isReversed: orientation === "reversed",
        slotLabel
      });
    }

    if (draws.length === 0) {
      return null;
    }

    return {
      spread,
      draws,
      dateKey,
      slug
    };
  }

  // Otherwise, fallback to the old format: dateKey--cardSlug--orientation
  const cardSlug = parts[1];
  const orientation = parts[2];

  const card = tarotCards.find((entry) => entry.slug === cardSlug);
  if (!card) {
    return null;
  }

  if (!["upright", "reversed"].includes(orientation)) {
    return null;
  }

  return {
    spread: "daily",
    draws: [
      {
        card,
        isReversed: orientation === "reversed"
      }
    ],
    dateKey,
    slug
  };
}

export function formatReadingDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1));
}

