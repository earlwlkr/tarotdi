import { AmbientOrbs } from "@/components/ambient-orbs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TarotCardFace } from "@/components/tarot-card";
import { formatReadingDate, getReadingFromSlug } from "@/lib/daily-reading";
import { getMeaningParagraphs } from "@/lib/tarot";

type ReadingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ReadingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const reading = getReadingFromSlug(slug);

  if (!reading || !reading.draws || reading.draws.length === 0) {
    return {
      title: "Reading Not Found"
    };
  }

  const firstCard = reading.draws[0].card;
  if (reading.spread === "daily") {
    return {
      title: `${firstCard.name} • Tarotdi`,
      description: reading.draws[0].isReversed ? firstCard.reversedMeaning : firstCard.uprightMeaning
    };
  } else {
    const spreadName =
      reading.spread === "three-card" ? "Three-Card Spread" : "Path of Choices Spread";
    return {
      title: `${spreadName} Reading • Tarotdi`,
      description: `A shared ${reading.spread} tarot reading drawn on ${formatReadingDate(reading.dateKey)}.`
    };
  }
}

export default async function ReadingPage({ params }: ReadingPageProps) {
  const { slug } = await params;
  const reading = getReadingFromSlug(slug);

  if (!reading || !reading.draws || reading.draws.length === 0) {
    notFound();
  }

  return (
    <main className="page-shell">
      <AmbientOrbs />

      <div
        style={{
          maxWidth: "1140px",
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "40px"
        }}
      >
        {/* Header summary of shared draw */}
        <header className="hero-copy" style={{ textAlign: "center" }}>
          <p className="eyebrow">Shared divination reading</p>
          <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}>
            {reading.spread === "daily"
              ? `Daily Draw: ${reading.draws[0].card.name}`
              : reading.spread === "three-card"
                ? "Timeline Spread (3 Cards)"
                : "Path of Choices (2 Cards)"}
          </h1>
          <div className="hero-meta" style={{ justifyContent: "center" }}>
            <span>{formatReadingDate(reading.dateKey)}</span>
            <span>
              {reading.spread === "daily"
                ? "1 Card"
                : reading.spread === "three-card"
                  ? "3 Cards"
                  : "2 Cards"}
            </span>
            <span style={{ textTransform: "uppercase" }}>{reading.spread} Spread</span>
          </div>
        </header>

        {/* Spread drawing slot grid */}
        <section className="hero-copy" style={{ padding: "40px 24px" }}>
          <div className="spread-slots-container">
            {reading.draws.map((draw, idx) => (
              <div key={idx} className="spread-slot">
                {draw.slotLabel && <span className="spread-slot-label">{draw.slotLabel}</span>}
                <TarotCardFace card={draw.card} isReversed={draw.isReversed} revealed visible />
              </div>
            ))}
          </div>
        </section>

        {/* Detailed interpretation scroll panels */}
        <section style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {reading.draws.map((draw, idx) => {
            const activeKeywords = draw.isReversed
              ? draw.card.reversedKeywords
              : draw.card.uprightKeywords;
            const meaningParagraphs = getMeaningParagraphs(draw.card, draw.isReversed);

            return (
              <article
                key={idx}
                className="reading-panel is-visible"
                style={{ opacity: 1, transform: "none" }}
              >
                <p className="reading-panel__label">
                  {draw.slotLabel ? `${draw.slotLabel} Card` : "Card Interpretation"}
                </p>
                <h3 style={{ fontSize: "2rem" }}>{draw.card.name}</h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "32px",
                    marginTop: "24px"
                  }}
                >
                  <div>
                    <p className="reading-panel__label">Key themes</p>
                    <ul className="meaning-tags" aria-label="Key themes">
                      {activeKeywords.map((keyword) => (
                        <li key={keyword}>{keyword}</li>
                      ))}
                    </ul>

                    <p className="reading-panel__label" style={{ marginTop: "28px" }}>
                      Reflection
                    </p>
                    <p
                      className="share-view__reflection"
                      style={{ marginTop: "12px", borderLeftWidth: "3px" }}
                    >
                      {draw.card.reflection}
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
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
