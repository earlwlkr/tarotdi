import { AmbientOrbs } from "@/components/ambient-orbs";
import { DailyReadingExperience } from "@/components/daily-reading";
import { formatReadingDate, getDailyReading } from "@/lib/daily-reading";

export default function HomePage() {
  const reading = getDailyReading();

  return (
    <main className="page-shell">
      <AmbientOrbs />
      <DailyReadingExperience reading={reading} formattedDate={formatReadingDate(reading.dateKey)} />
    </main>
  );
}
