const LABELS = {
  brand: "مدار",
  submit: "إرسال",
} as const;

interface Props {
  onSubmit: () => void;
}

export default function TaskNavbar({ onSubmit }: Props) {
  return (
    <nav className="flex w-full items-center justify-between bg-bg-dark-secondary px-6 py-3">
      <span className="text-xl font-bold tracking-wide text-text-on-dark">
        {LABELS.brand}
      </span>

      <button
        type="button"
        onClick={onSubmit}
        className="flex cursor-pointer items-center gap-2 rounded-lg border-0 bg-gold px-5 py-2 text-sm font-bold text-bg-dark transition-colors duration-200 hover:bg-gold-dark"
      >
        {LABELS.submit}
        <i className="fa-solid fa-arrow-left" aria-hidden="true" />
      </button>
    </nav>
  );
}
