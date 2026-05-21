import type { UserComment } from "@/types/PMTask";
import "@/style/scrollbar.css";

interface Props {
  comments: UserComment[];
}

export default function CommentsView({ comments }: Props) {
  console.log(">>> comments:", comments);
  return (
    <div
      className="custom-scrollbar h-full overflow-auto px-5 py-4 flex flex-col gap-3"
      dir="rtl"
    >
      {comments.map((comment) => {
        return (
          <div
            key={comment.id}
            className="bg-white/5 border border-white/8 rounded-xl px-4 py-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-teal/20 flex items-center justify-center text-teal text-[12px] font-bold shrink-0">
                  {comment.author[0]}
                </div>
                <span className="text-[13px] font-bold text-text-on-dark">
                  {comment.author}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-text-muted">
                  {comment.date}
                </span>
              </div>
            </div>
            <p className="text-[13px] text-text-muted leading-relaxed">
              {comment.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}
