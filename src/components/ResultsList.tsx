type ResultsListProps = {
  results: string[];
  selectedLength: number;
  isLoading?: boolean;
};

export function ResultsList({
  results,
  selectedLength,
  isLoading = false,
}: ResultsListProps) {
  return (
    <section
      aria-labelledby="results-heading"
      className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#181818] text-white shadow-panel"
    >
      <div className="h-1 bg-[linear-gradient(90deg,#f97316_0%,#fb7185_48%,#22d3ee_100%)]" />
      <div className="p-4">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
              Matches
            </p>
            <h2 id="results-heading" className="font-display text-xl font-bold text-white">
              {isLoading ? "Loading words..." : `${results.length} possible words`}
            </h2>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
            {selectedLength} letters
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {isLoading
            ? "Word list is loading."
            : `${results.length} results found for ${selectedLength} letters.`}
        </p>

        {isLoading ? (
          <div
            role="status"
            className="rounded-[0.9rem] border border-dashed border-white/15 bg-[#101010] px-4 py-10 text-center text-slate-400"
          >
            Loading word list...
          </div>
        ) : results.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            {results.map((word) => (
              <li
                key={word}
                className="list-none rounded-[0.9rem] border border-white/10 bg-[#101010] px-3 py-2.5 font-body text-base font-semibold tracking-[0.03em] text-white transition hover:border-orange-400/50 hover:bg-[#141414]"
              >
                {word}
              </li>
            ))}
          </ul>
        ) : (
          <div
            role="status"
            className="rounded-[0.9rem] border border-dashed border-white/15 bg-[#101010] px-4 py-10 text-center text-slate-400"
          >
            No words match the current pattern.
          </div>
        )}
      </div>
    </section>
  );
}
