import { useNavigate, useParams } from "react-router-dom";
import { formatTime } from "../../utils/timeUtils";

const LABELS = {
  brand: "مدار",
  submit: "إرسال",
} as const;

interface Props {
  timeLeft?: number;
  taskTitle?: string;
}

export default function TaskNavbar({ timeLeft = 872, taskTitle }: Props) {
  const navigate = useNavigate();
  const { id, taskId } = useParams<{ id: string; taskId: string }>();
  const isLow = timeLeft < 120;

  const handleSubmit = () => {
    navigate(`/jobs/${id}/tasks/${taskId}/review`);
  };

  return (
    <nav
      dir="rtl"
      className="w-full flex items-center justify-between px-6 py-3 bg-bg-dark-secondary shrink-0"
    >
      {/* Brand */}
      <span className="text-xl font-bold tracking-wide text-text-on-dark">
        {LABELS.brand}
      </span>

      {/* Task title (center) */}
      {taskTitle && (
        <span className="text-sm font-medium text-text-on-dark/70 hidden sm:block truncate max-w-xs text-center">
          {taskTitle}
        </span>
      )}

      {/* Right side: timer + submit */}
      <div className="flex items-center gap-3">
        {/* Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
            isLow
              ? "bg-red-500/15 text-red-400 border-red-500/40"
              : "bg-white/8 text-text-on-dark border-white/15"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLow
                ? "bg-red-400 shadow-[0_0_6px_#FF6B6B]"
                : "bg-green-400 shadow-[0_0_6px_#4ADE80]"
            }`}
          />
          {formatTime(timeLeft)}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold bg-gold hover:bg-gold-dark text-bg-dark transition-colors duration-200 cursor-pointer border-0"
        >
          {LABELS.submit}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
