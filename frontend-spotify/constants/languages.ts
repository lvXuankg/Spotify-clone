import type { Languages } from "../interfaces/languages";

export const AVAILABLE_LANGUAGES = [
  { value: "en", label: "English", englishLabel: "English" },
  {
    value: "vi",
    label: "Tiếng việt",
    englishLabel: "Vietnamese",
  },
] as {
  label: string;
  value: Languages;
  englishLabel: string;
}[];
