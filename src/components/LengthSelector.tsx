type LengthSelectorProps = {
  availableLengths: number[];
  selectedLength: number;
  onSelect: (length: number) => void;
};

export function LengthSelector({
  availableLengths,
  selectedLength,
  onSelect,
}: LengthSelectorProps) {
  return (
    <section
      aria-labelledby="word-length-heading"
      className="h-full rounded-[1.2rem] border border-white/10 bg-[#121212] p-4"
    >
      <div className="mb-3">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300/80">
          Word Length
        </p>
        <h2 id="word-length-heading" className="font-display text-xl font-bold text-white">
          Set the size
        </h2>
        <p className="mt-1 text-xs text-slate-400">{selectedLength} letters selected.</p>
      </div>
      <label className="block">
        <span id="word-length-label" className="mb-2 block text-xs font-medium text-slate-400">
          Letter count
        </span>
        <select
          aria-describedby="word-length-heading"
          aria-labelledby="word-length-label"
          value={selectedLength}
          onChange={(event) => onSelect(Number(event.target.value))}
          className="w-full appearance-none rounded-[0.9rem] border border-white/10 bg-[#101010] px-3 py-2.5 text-sm font-semibold text-white outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
        >
          {availableLengths.map((length) => (
            <option key={length} value={length}>
              {length} letters
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
