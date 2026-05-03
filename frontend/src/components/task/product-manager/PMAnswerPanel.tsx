import { useState } from "react";
import type { ChangeEvent } from "react";

const LABELS = {
  heading:     "تحليلك وتوصياتك",
  placeholder: "اكتب تحليلك، أولوياتك، والخطوات المقترحة هنا...",
} as const;

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function PMAnswerPanel({ value, onChange }: Props) {
  return (
    <div
      dir="rtl"
      className="border-t border-white/8 shrink-0 bg-bg-dark flex flex-col"
      style={{ height: "200px" }}
    >
      <div className="px-4 py-2.5 border-b border-white/8 shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
          {LABELS.heading}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder={LABELS.placeholder}
        className="flex-1 resize-none bg-transparent px-4 py-3 text-[13px] leading-relaxed text-text-muted outline-none placeholder:text-text-muted/30"
      />
    </div>
  );
}
