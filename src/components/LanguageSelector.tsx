type Language = {
  code: string;
  label: string;
};

type LanguageSelectorProps = {
  languages: Language[];
  selectedLanguage: string;
  onSelect: (languageCode: string) => void;
  label?: string;
};

export function LanguageSelector({
  languages,
  selectedLanguage,
  onSelect,
  label = "Language",
}: LanguageSelectorProps) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={selectedLanguage}
        onChange={(event) => onSelect(event.target.value)}
        className="block w-full appearance-none rounded-[0.75rem] border border-white/10 bg-[#101010] px-3 py-2 text-sm font-medium text-white outline-none transition focus:border-white/20 focus:ring-4 focus:ring-white/5"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}
