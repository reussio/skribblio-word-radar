import { useEffect, useMemo, useState } from "react";
import { LanguageSelector } from "./components/LanguageSelector";
import { LengthSelector } from "./components/LengthSelector";
import { LetterInputs } from "./components/LetterInputs";
import { ResultsList } from "./components/ResultsList";

const languageData = {
  en: { label: "English" },
  es: { label: "Spanish" },
  fr: { label: "French" },
  de: { label: "German" },
  ko: { label: "Korean" },
} as const;

type LanguageCode = keyof typeof languageData;
type LoadedWords = Partial<Record<LanguageCode, string[]>>;

const languageLoaders: Record<LanguageCode, () => Promise<string[]>> = {
  en: () => import("./data/en.json").then((module) => module.default),
  es: () => import("./data/es.json").then((module) => module.default),
  fr: () => import("./data/fr.json").then((module) => module.default),
  de: () => import("./data/de.json").then((module) => module.default),
  ko: () => import("./data/ko.json").then((module) => module.default),
};

function getCharacterLength(word: string) {
  return Array.from(word).length;
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase();
}

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  const [loadedWords, setLoadedWords] = useState<LoadedWords>({});
  const [isLoadingWords, setIsLoadingWords] = useState(true);
  const languageWords = loadedWords[selectedLanguage] ?? [];

  useEffect(() => {
    let isCancelled = false;

    async function loadWords() {
      if (loadedWords[selectedLanguage]) {
        setIsLoadingWords(false);
        return;
      }

      setIsLoadingWords(true);

      const words = await languageLoaders[selectedLanguage]();

      if (isCancelled) {
        return;
      }

      setLoadedWords((currentWords) => ({
        ...currentWords,
        [selectedLanguage]: words,
      }));
      setIsLoadingWords(false);
    }

    void loadWords();

    return () => {
      isCancelled = true;
    };
  }, [loadedWords, selectedLanguage]);

  const availableLengths = useMemo(() => {
    return Array.from(new Set(languageWords.map(getCharacterLength))).sort((a, b) => a - b);
  }, [languageWords]);

  const [selectedLength, setSelectedLength] = useState<number>(availableLengths[0] ?? 0);
  const [letters, setLetters] = useState<string[]>(Array(selectedLength).fill(""));

  useEffect(() => {
    setSelectedLength((currentLength) =>
      availableLengths.includes(currentLength) ? currentLength : (availableLengths[0] ?? 0),
    );
  }, [availableLengths]);

  useEffect(() => {
    setLetters((currentLetters) =>
      Array.from({ length: selectedLength }, (_, index) => currentLetters[index] ?? ""),
    );
  }, [selectedLength]);

  const results = useMemo(() => {
    return languageWords.filter((word) => {
      const characters = Array.from(word);

      if (characters.length !== selectedLength) {
        return false;
      }

      return letters.every((letter, index) => {
        if (!letter) {
          return true;
        }

        return normalize(characters[index]) === normalize(letter);
      });
    });
  }, [languageWords, selectedLength, letters]);

  const languageCards = useMemo(
    () =>
      Object.entries(languageData).map(([code, entry]) => ({
        code,
        label: entry.label,
      })),
    [],
  );

  return (
    <div className="min-h-screen bg-[#121212] font-body text-slate-100">
      <div className="relative min-h-screen bg-[linear-gradient(180deg,#1a1a1a_0%,#111111_100%)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),transparent_70%)]" />
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.34em] text-orange-300/90">
                Skribbl.io Word Radar
              </p>
              <h1 className="mt-1.5 font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                Find the word from the pattern.
              </h1>
            </div>
            <div className="flex gap-2">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                {languageData[selectedLanguage].label}
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                {isLoadingWords ? "Loading..." : `${results.length} hits`}
              </div>
            </div>
          </header>

          <main className="flex flex-1 flex-col gap-4" role="search" aria-label="Word finder">
            <section className="rounded-[1.5rem] border border-white/10 bg-[#181818] p-4 shadow-panel sm:p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                    Input
                  </p>
                  <h2 className="mt-1.5 font-display text-2xl font-extrabold text-white">
                    Fill the pattern
                  </h2>
                </div>

                <div className="w-full sm:w-[180px]">
                  <LanguageSelector
                    languages={languageCards}
                    selectedLanguage={selectedLanguage}
                    onSelect={(languageCode) => setSelectedLanguage(languageCode as LanguageCode)}
                    label="Language"
                  />
                </div>
              </div>

              <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-stretch">
                <div className="min-w-0">
                  <LetterInputs
                    letters={letters}
                    onChange={(index, value) => {
                      setLetters((currentLetters) =>
                        currentLetters.map((letter, currentIndex) =>
                          currentIndex === index ? value : letter,
                        ),
                      );
                    }}
                  />
                </div>

                <LengthSelector
                  availableLengths={availableLengths}
                  selectedLength={selectedLength}
                  onSelect={setSelectedLength}
                />
              </div>

            </section>

            <div className="min-w-0">
              <ResultsList
                results={results}
                selectedLength={selectedLength}
                isLoading={isLoadingWords}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
