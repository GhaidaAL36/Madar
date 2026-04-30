const LABELS = {
  confirm:    "تأكيد الإرسال",
  confirmMsg: "هل أنت متأكد من إرسال إجابتك؟ لن تتمكن من التعديل بعد الإرسال.",
  confirmYes: "نعم، إرسال",
  confirmNo:  "مراجعة الإجابة",
} as const;

interface Props {
  onConfirm: () => void;
  onCancel:  () => void;
}

export default function ConfirmModal({ onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div dir="rtl" className="bg-bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-bg-dark px-6 py-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent">
              <path d="M12 9v4M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <span className="text-text-on-dark font-bold text-[15px]">{LABELS.confirm}</span>
        </div>

        <div className="px-6 py-5">
          <p className="text-text-muted text-[14px] leading-relaxed">{LABELS.confirmMsg}</p>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-accent hover:bg-accent-hover text-bg-dark font-bold text-[14px] py-3 rounded-xl transition-colors cursor-pointer border-0"
          >
            {LABELS.confirmYes}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-bg-card-secondary hover:bg-bg-card-secondary/70 text-text-primary font-bold text-[14px] py-3 rounded-xl transition-colors cursor-pointer border-0"
          >
            {LABELS.confirmNo}
          </button>
        </div>
      </div>
    </div>
  );
}