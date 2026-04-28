interface Props {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "ltr" | "rtl";
}

function InputField({ label, type, placeholder, value, onChange, dir }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-bold text-bg-dark-secondary">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        className="w-full bg-bg-card border border-teal-pale rounded-md px-4 py-3 text-[14px] text-bg-dark-secondary placeholder:text-text-muted/60 outline-none transition-all duration-200 focus:border-teal focus:shadow-[0_0_0_3px_rgba(46,125,140,0.1)]"
      />
    </div>
  );
}

export default InputField;