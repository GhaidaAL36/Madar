const LABELS = {
  brand: "مدار",
} as const;


export default function TaskNavbar() {
  return (
    <nav className="flex w-full items-center justify-between bg-bg-dark-secondary px-6 py-3">
      <span className="text-xl font-bold tracking-wide text-text-on-dark">
        {LABELS.brand}
      </span>

    </nav>
  );
}
