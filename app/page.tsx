
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-2xl text-center p-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-tamil">
          உலா
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Your trusted taxi booking app. enter the location choose a driver reach your destination
        </p>
        <Link
          href="/login"
          className="inline-block rounded-[var(--radius)] bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 font-medium shadow-md hover:shadow-lg transition-shadow"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}