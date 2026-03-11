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

  if (!reading) {
    return {
      title: "Reading Not Found"
    };
  }

  return {
    title: `${reading.card.name} • Tarot of the Day`,
    description: reading.isReversed ? reading.card.reversedMeaning : reading.card.uprightMeaning
  };
}

export default async function ReadingPage({ params }: ReadingPageProps) {
  const { slug } = await params;
  const reading = getReadingFromSlug(slug);

  if (!reading) {
    notFound();
  }

  const activeKeywords = reading.isReversed ? reading.card.reversedKeywords : reading.card.uprightKeywords;
  const meaningParagraphs = getMeaningParagraphs(reading.card, reading.isReversed);

  return (
    <main className="page-shell page-shell--reading">
      <AmbientOrbs />
      <section className="share-view">
        <div className="share-view__copy">
          <p className="eyebrow">Shared daily reading</p>
          <h1>{reading.card.name}</h1>
          <div className="hero-meta">
            <span>{formatReadingDate(reading.dateKey)}</span>
            <span>{reading.card.arcana}</span>
            <span>{reading.isReversed ? "Reversed" : "Upright"}</span>
          </div>
          <p className="reading-panel__label">Key themes</p>
          <ul className="meaning-tags meaning-tags--inline" aria-label="Key themes">
            {activeKeywords.map((keyword) => (
              <li key={keyword}>{keyword}</li>
            ))}
          </ul>
          <p className="reading-panel__label">Reflection</p>
          <p className="share-view__reflection">{reading.card.reflection}</p>
          <p className="reading-panel__label">Meaning</p>
          <div className="meaning-copy meaning-copy--inline">
            {meaningParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <TarotCardFace card={reading.card} isReversed={reading.isReversed} revealed />
      </section>
    </main>
  );
}
