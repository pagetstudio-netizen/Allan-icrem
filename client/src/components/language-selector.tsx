import { useState } from "react";
import { Search, Check } from "lucide-react";
import { LANGUAGES, useLanguage } from "@/lib/i18n";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function LanguageSelector({ open, onClose }: Props) {
  const { lang, setLang, t } = useLanguage();
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filtered = LANGUAGES.filter(l =>
    l.nativeLabel.toLowerCase().includes(search.toLowerCase()) ||
    l.label.toLowerCase().includes(search.toLowerCase())
  );

  function select(code: string) {
    setLang(code);
    setSearch("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center"
      onClick={onClose}
    >
      {/* dim backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* bottom sheet */}
      <div
        className="relative z-10 w-full max-w-lg bg-white rounded-t-3xl px-4 pt-5 pb-10 shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        {/* drag handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

        {/* search bar */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5 mb-4">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("searchLanguage")}
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
            autoFocus
          />
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-3 gap-2">
          {filtered.map(language => {
            const isSelected = language.code === lang;
            return (
              <button
                key={language.code}
                onClick={() => select(language.code)}
                className="flex items-center justify-between gap-1 rounded-2xl px-3 py-3 text-left border transition-colors"
                style={{
                  borderColor: isSelected ? "#111111" : "#e5e7eb",
                  background: isSelected ? "#f8f8f8" : "white",
                }}
              >
                <span
                  className="text-sm leading-snug font-medium flex-1"
                  style={{ color: isSelected ? "#111111" : "#374151" }}
                >
                  {language.nativeLabel}
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "#22c55e" }} />
                )}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-6">{t("searchLanguage")}</p>
        )}
      </div>
    </div>
  );
}
