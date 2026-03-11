export type TarotSuit = "Major Arcana" | "Cups" | "Pentacles" | "Swords" | "Wands";

export type TarotCard = {
  slug: string;
  name: string;
  arcana: TarotSuit;
  suit: TarotSuit;
  number: string;
  uprightMeaning: string;
  reversedMeaning: string;
  reflection: string;
  palette: {
    glow: string;
    accent: string;
    ink: string;
  };
  symbols: string[];
};

export type DailyReading = {
  card: TarotCard;
  isReversed: boolean;
  dateKey: string;
  slug: string;
};

export function slugify(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function buildDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function makeReadingSlug(dateKey: string, cardSlug: string, isReversed: boolean) {
  return `${dateKey}--${cardSlug}--${isReversed ? "reversed" : "upright"}`;
}
