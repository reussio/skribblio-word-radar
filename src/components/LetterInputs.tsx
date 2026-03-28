import { useRef, useState } from "react";

type LetterInputsProps = {
  letters: string[];
  onChange: (index: number, value: string) => void;
};

export function LetterInputs({ letters, onChange }: LetterInputsProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [allSelected, setAllSelected] = useState(false);

  return (
    <section
      aria-labelledby="known-letters-heading"
      className="h-full rounded-[1.2rem] border border-white/10 bg-[#121212] p-4"
    >
      <div className="mb-3">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300/80">
          Known Letters
        </p>
        <h2 id="known-letters-heading" className="font-display text-xl font-bold text-white">
          Enter what you know
        </h2>
        <p id="known-letters-help" className="mt-1 text-xs text-slate-400">
          Leave slots blank if they are unknown.
        </p>
      </div>
      <div
        role="group"
        aria-describedby="known-letters-help"
        aria-label={`Known letters, ${letters.length} positions`}
        className="grid gap-2.5"
        style={{ gridTemplateColumns: `repeat(${letters.length}, minmax(0, 1fr))` }}
      >
        {letters.map((letter, index) => (
          <input
            key={`${index}-${letters.length}`}
            ref={(node) => {
              inputRefs.current[index] = node;
            }}
            type="text"
            inputMode="text"
            aria-label={`Letter position ${index + 1} of ${letters.length}`}
            value={letter}
            placeholder="_"
            onChange={(event) => {
              setAllSelected(false);
              const nextValue = Array.from(event.target.value).slice(-1)[0] ?? "";
              onChange(index, nextValue);

              if (nextValue && index < letters.length - 1) {
                inputRefs.current[index + 1]?.focus();
                inputRefs.current[index + 1]?.select();
              }
            }}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
                event.preventDefault();
                setAllSelected(true);
                const activeElement = document.activeElement;

                if (activeElement instanceof HTMLInputElement) {
                  activeElement.select();
                }

                return;
              }

              if (allSelected && (event.key === "Backspace" || event.key === "Delete")) {
                event.preventDefault();
                letters.forEach((_, letterIndex) => onChange(letterIndex, ""));
                setAllSelected(false);
                inputRefs.current[0]?.focus();
                return;
              }

              if (
                allSelected &&
                event.key.length === 1 &&
                !event.altKey &&
                !event.ctrlKey &&
                !event.metaKey
              ) {
                event.preventDefault();
                letters.forEach((_, letterIndex) => onChange(letterIndex, ""));
                onChange(0, event.key);
                setAllSelected(false);

                if (letters.length > 1) {
                  inputRefs.current[1]?.focus();
                }

                return;
              }

              if (event.key === "Backspace" && !letters[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
                inputRefs.current[index - 1]?.select();
              }
              if (event.key === "ArrowLeft" && index > 0) {
                inputRefs.current[index - 1]?.focus();
              }
              if (event.key === "ArrowRight" && index < letters.length - 1) {
                inputRefs.current[index + 1]?.focus();
              }
            }}
            onFocus={() => {
              if (!allSelected) {
                return;
              }

              inputRefs.current[index]?.select();
            }}
            onClick={() => setAllSelected(false)}
            className={`h-14 min-w-0 rounded-[0.9rem] border bg-[#0f0f0f] text-center font-display text-xl font-bold uppercase text-white outline-none transition placeholder:text-slate-600 focus:bg-[#111] focus:ring-4 ${
              allSelected
                ? "border-emerald-400 ring-4 ring-emerald-500/15"
                : "border-white/10 focus:border-emerald-400 focus:ring-emerald-500/15"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
