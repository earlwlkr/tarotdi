import { DailyReadingExperience } from "@/components/daily-reading";
import { formatReadingDate, getDailyReading } from "@/lib/daily-reading";

export default function HomePage() {
  const reading = getDailyReading();

  return (
    <main className="page-shell">
      <div className="aurora aurora--left" />
      <div className="aurora aurora--right" />
      <DailyReadingExperience reading={reading} formattedDate={formatReadingDate(reading.dateKey)} />
    </main>
  );
}
