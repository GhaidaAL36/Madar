interface Props {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

function SectionCard({ title, icon, children }: Props) {
  return (
    <div className="bg-white rounded-[20px] shadow-[0_8px_28px_rgba(26,58,74,0.07)] overflow-hidden">
      <div className="flex items-center gap-2 px-7 py-4 border-b border-gray-100">
        {icon && <span className="text-[15px]">{icon}</span>}
        <span className="text-[14px] font-bold text-bg-dark">{title}</span>
      </div>
      <div className="px-7 py-5">{children}</div>
    </div>
  );
}

export default SectionCard;