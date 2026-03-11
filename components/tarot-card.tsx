import type { CSSProperties } from "react";

import type { TarotCard } from "@/lib/tarot";

type TarotCardProps = {
  card: TarotCard;
  isReversed: boolean;
  revealed: boolean;
};

export function TarotCardFace({ card, isReversed, revealed }: TarotCardProps) {
  return (
    <article
      className={`tarot-card ${revealed ? "is-revealed" : ""} ${isReversed ? "is-reversed" : ""}`}
      style={
        {
          ["--card-glow" as string]: card.palette.glow,
          ["--card-accent" as string]: card.palette.accent,
          ["--card-ink" as string]: card.palette.ink
        } as CSSProperties
      }
    >
      <div className="tarot-card__frame" />
      <div className="tarot-card__halo" />
      <header className="tarot-card__header">
        <span>{card.arcana}</span>
        <span>{card.number}</span>
      </header>
      <div className="tarot-card__art">
        <div className="tarot-card__sigil" />
        <div className="tarot-card__orbit tarot-card__orbit--one" />
        <div className="tarot-card__orbit tarot-card__orbit--two" />
        <div className="tarot-card__symbols">
          {card.symbols.map((symbol) => (
            <span key={symbol}>{symbol}</span>
          ))}
        </div>
      </div>
      <footer className="tarot-card__footer">
        <h2>{card.name}</h2>
        <p>{isReversed ? "Reversed" : "Upright"}</p>
      </footer>
    </article>
  );
}
