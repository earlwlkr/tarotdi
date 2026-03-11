export type TarotSuit = "Major Arcana" | "Cups" | "Pentacles" | "Swords" | "Wands";

export type TarotCard = {
  slug: string;
  name: string;
  arcana: TarotSuit;
  suit: TarotSuit;
  number: string;
  uprightMeaning: string;
  reversedMeaning: string;
  uprightKeywords: string[];
  reversedKeywords: string[];
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

const suitInterpretations: Record<TarotSuit, { upright: string; reversed: string }> = {
  "Major Arcana": {
    upright: "This card points to a larger life lesson or threshold moment, so its message tends to describe the deeper pattern beneath today's surface events.",
    reversed: "In reversal, the lesson is still active but blocked, delayed, or resisted, which can make the day feel fated, repetitive, or emotionally charged until you respond consciously."
  },
  Cups: {
    upright: "In the suit of Cups, the emphasis falls on emotion, intimacy, intuition, and the tone of your relationships with yourself and others.",
    reversed: "In the suit of Cups reversed, emotions may be flooding, hidden, or misdirected, so the work is to feel honestly without letting feeling run the whole situation."
  },
  Pentacles: {
    upright: "In the suit of Pentacles, the card speaks through money, work, health, home, and the practical structures that support daily life.",
    reversed: "In the suit of Pentacles reversed, stability may be shaky or overcontrolled, asking you to look at habits, resources, and what is materially sustainable."
  },
  Swords: {
    upright: "In the suit of Swords, the lesson often arrives through thought patterns, hard conversations, decisions, and the stories shaping your perception.",
    reversed: "In the suit of Swords reversed, confusion, overthinking, or harsh mental loops may be distorting the truth, so clarity has to be rebuilt carefully."
  },
  Wands: {
    upright: "In the suit of Wands, the energy centers on drive, confidence, desire, creativity, and the courage to move before momentum cools.",
    reversed: "In the suit of Wands reversed, energy can scatter into impatience, burnout, or hesitation, making it important to direct your fire rather than merely feel it."
  }
};

const rankInterpretations: Record<string, { upright: string; reversed: string }> = {
  Ace: {
    upright: "As an Ace, it marks a fresh opening: a seed, invitation, or spark that can become significant if you engage it early and sincerely.",
    reversed: "As an Ace reversed, the opening is present but compromised by timing, hesitation, or weak roots, so the beginning needs more honesty and structure."
  },
  Two: {
    upright: "As a Two, it emphasizes duality, choice, balance, and the need to work skillfully with tension between two valid forces.",
    reversed: "As a Two reversed, balance is harder to maintain, and indecision, avoidance, or asymmetry may be keeping the next step from becoming obvious."
  },
  Three: {
    upright: "As a Three, it points to growth through connection, early expansion, and the momentum that comes when something starts taking visible shape.",
    reversed: "As a Three reversed, development can stall through poor coordination, weak support, or growth that is spreading faster than it can hold."
  },
  Four: {
    upright: "As a Four, it highlights foundations, containment, stability, and the structures that protect what matters.",
    reversed: "As a Four reversed, stability may be too brittle or too loose, suggesting that what once felt secure now needs adjusting."
  },
  Five: {
    upright: "As a Five, the card moves through friction, disruption, grief, or challenge, often pushing change by making comfort impossible.",
    reversed: "As a Five reversed, conflict may be easing, internalized, or lingering longer than necessary because the underlying lesson has not been met directly."
  },
  Six: {
    upright: "As a Six, it tends to restore flow through reciprocity, recognition, support, or movement after a more difficult phase.",
    reversed: "As a Six reversed, imbalance becomes more obvious, especially where support, fairness, or validation is uneven."
  },
  Seven: {
    upright: "As a Seven, it asks for discernment, conviction, and a clearer relationship to effort, faith, or assessment.",
    reversed: "As a Seven reversed, doubt, distraction, or strategic confusion can make it difficult to know what is truly worth your energy."
  },
  Eight: {
    upright: "As an Eight, it often marks acceleration, mastery, or a consequential turning point where things begin moving decisively.",
    reversed: "As an Eight reversed, pressure can become restriction, speed can become chaos, and movement may need to slow before it can become meaningful."
  },
  Nine: {
    upright: "As a Nine, the card carries maturity, culmination, and the near-completion stage where resilience or fulfillment is being tested.",
    reversed: "As a Nine reversed, exhaustion, overextension, or isolation may be distorting what should otherwise be a moment of earned understanding."
  },
  Ten: {
    upright: "As a Ten, it shows the full weight or fulfillment of a cycle, revealing what completion actually costs and provides.",
    reversed: "As a Ten reversed, the cycle is still completing, but through overload, delayed closure, or difficulty releasing what has already run its course."
  },
  Page: {
    upright: "As a Page, the message is exploratory and developmental, favoring curiosity, study, and an openness to learning by doing.",
    reversed: "As a Page reversed, immaturity, reluctance, or scattered attention can keep a promising message from maturing into action."
  },
  Knight: {
    upright: "As a Knight, the card is mobile and active, describing pursuit, momentum, and the way desire gets translated into movement.",
    reversed: "As a Knight reversed, pursuit can become impulsive, erratic, or overdriven, so the challenge is to direct energy instead of being ruled by it."
  },
  Queen: {
    upright: "As a Queen, it emphasizes embodied mastery, self-possession, and influence expressed through presence rather than force.",
    reversed: "As a Queen reversed, the same power can become strained by overwhelm, defensiveness, or disconnection from your deeper center."
  },
  King: {
    upright: "As a King, it speaks through leadership, stewardship, and the outward management of power, responsibility, or expertise.",
    reversed: "As a King reversed, authority may harden into control, detachment, or ego, making wise leadership harder to sustain."
  }
};

function formatList(items: string[]) {
  if (items.length === 0) {
    return "";
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

export function getMeaningParagraphs(card: TarotCard, isReversed: boolean) {
  const primaryMeaning = isReversed ? card.reversedMeaning : card.uprightMeaning;
  const activeKeywords = isReversed ? card.reversedKeywords : card.uprightKeywords;
  const suitInterpretation = suitInterpretations[card.suit][isReversed ? "reversed" : "upright"];
  const rankInterpretation = card.suit === "Major Arcana"
    ? isReversed
      ? "Because it is a Major Arcana card, the reversal usually feels bigger than a passing mood and may point to a chapter that is being resisted rather than completed."
      : "Because it is a Major Arcana card, its influence usually reaches beyond one moment and highlights a wider shift in identity, timing, or purpose."
    : rankInterpretations[card.number][isReversed ? "reversed" : "upright"];
  const keywordText = formatList(activeKeywords.map((keyword) => keyword.toLowerCase()));
  const guidance = isReversed
    ? `Taken together, ${card.name} suggests that ${keywordText} are not just themes around you, but areas where energy may be blocked, excessive, or turned inward. The most useful response is usually to slow down, name what is out of balance, and correct the pattern before acting from pressure.`
    : `Taken together, ${card.name} emphasizes ${keywordText} as active strengths or invitations in the moment. The most useful response is usually to participate deliberately in what is opening rather than waiting for perfect certainty.`;

  return [primaryMeaning, `${suitInterpretation} ${rankInterpretation}`, guidance];
}

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
