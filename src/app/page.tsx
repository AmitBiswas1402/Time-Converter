import { ConverterApp } from "@/components/ConverterApp";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between p-4 sm:p-8 md:p-12 font-sans selection:bg-blue-500/20">
      <div className="flex-1 flex flex-col items-center justify-start max-w-6xl mx-auto w-full py-2">
        <ConverterApp />
      </div>

      <footer className="py-6 text-center text-xs text-zinc-400 dark:text-zinc-600 border-t border-zinc-200/50 dark:border-zinc-800/50 mt-12 w-full max-w-4xl mx-auto">
        <p>Instant client-side timezone calculations powered by native Intl API.</p>
      </footer>
    </main>
  );
}