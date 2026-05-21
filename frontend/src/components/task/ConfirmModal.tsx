const LABELS = {
  confirm: "تأكيد الإرسال",
  confirmMsg: "هل أنت متأكد من إرسال إجابتك؟ لن تتمكن من التعديل بعد الإرسال.",
  confirmYes: "نعم، إرسال",
  confirmNo: "مراجعة الإجابة",
} as const;

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-bg-card shadow-2xl"
      >
        <div className="flex items-center gap-3 bg-bg-dark px-6 py-5">
          <div
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20"
          />

          <span
            id="confirm-modal-title"
            className="text-[15px] font-bold text-text-on-dark"
          >
            {LABELS.confirm}
          </span>
        </div>

        <div className="px-6 py-5">
          <p className="text-[14px] leading-relaxed text-text-muted">
            {LABELS.confirmMsg}
          </p>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-xl border-0 bg-accent py-3 text-[14px] font-bold text-bg-dark transition-colors hover:bg-accent-hover"
          >
            {LABELS.confirmYes}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-xl border-0 bg-bg-card-secondary py-3 text-[14px] font-bold text-text-primary transition-colors hover:bg-bg-card-secondary/70"
          >
            {LABELS.confirmNo}
          </button>
        </div>
      </div>
    </div>
  );
}
