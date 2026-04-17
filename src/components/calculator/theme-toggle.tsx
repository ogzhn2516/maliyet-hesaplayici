type ThemeToggleProps = {
  theme: "light" | "dark";
  onChange: (theme: "light" | "dark") => void;
};

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-strong)] p-1">
      <button
        type="button"
        onClick={() => onChange("light")}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          theme === "light"
            ? "bg-[var(--accent)] text-white"
            : "text-[var(--muted)]"
        }`}
        aria-pressed={theme === "light"}
      >
        <SunIcon />
        Açık
      </button>
      <button
        type="button"
        onClick={() => onChange("dark")}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          theme === "dark"
            ? "bg-[var(--accent)] text-white"
            : "text-[var(--muted)]"
        }`}
        aria-pressed={theme === "dark"}
      >
        <MoonIcon />
        Koyu
      </button>
    </div>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current stroke-2"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current stroke-2"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7.2 7.2 0 0 0 9.8 9.8Z" />
    </svg>
  );
}
