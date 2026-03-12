import { tarotCards } from "@/data/tarot-cards";
import { buildDateKey, hashString, makeReadingSlug, type DailyReading } from "@/lib/tarot";

export function getDailyReading(date = new Date()): DailyReading {
  const dateKey = buildDateKey(date);
  const hash = hashString(dateKey);
  const card = tarotCards[hash % tarotCards.length];
  const isReversed = (hash >> 3) % 2 === 1;

  return {
    card,
    isReversed,
    dateKey,
    slug: makeReadingSlug(dateKey, card.slug, isReversed)
  };
}

export function getReadingFromSlug(slug: string): DailyReading | null {
  const [dateKey, cardSlug, orientation] = slug.split("--");
  if (!dateKey || !cardSlug || !orientation) {
    return null;
  }

  const card = tarotCards.find((entry) => entry.slug === cardSlug);
  if (!card) {
    return null;
  }

  const isReversed = orientation === "reversed";
  if (!["upright", "reversed"].includes(orientation)) {
    return null;
  }

  return {
    card,
    isReversed,
    dateKey,
    slug: makeReadingSlug(dateKey, card.slug, isReversed)
  };
}

export function formatReadingDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(year, (month ?? 1) - 1, day ?? 1));
}
