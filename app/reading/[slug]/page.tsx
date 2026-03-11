import { AmbientOrbs } from "@/components/ambient-orbs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TarotCardFace } from "@/components/tarot-card";
import { formatReadingDate, getReadingFromSlug } from "@/lib/daily-reading";

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

  return (
    <main className="page-shell page-shell--reading">
      <AmbientOrbs />
      <section className="share-view">
        <div className="share-view__copy">
          <p className="eyebrow">Shared daily reading</p>
          <h1>{reading.card.name}</h1>
          <p className="lede">{reading.isReversed ? reading.card.reversedMeaning : reading.card.uprightMeaning}</p>
          <div className="hero-meta">
            <span>{formatReadingDate(reading.dateKey)}</span>
            <span>{reading.card.arcana}</span>
            <span>{reading.isReversed ? "Reversed" : "Upright"}</span>
          </div>
          <p className="share-view__reflection">{reading.card.reflection}</p>
        </div>
        <TarotCardFace card={reading.card} isReversed={reading.isReversed} revealed />
      </section>
    </main>
  );
}
