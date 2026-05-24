import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import type { AdminSimulation } from "../../types/admin";

const LABELS = {
    heading: "المحاكاة",
    anonymous: "زائر",
    completed: "مكتملة",
    inProgress: "جارية",
    noData: "لا توجد محاكاة بعد",
    viewReview: "عرض التقييم",
} as const;

const TASK_TYPE_LABELS: Record<string, string> = {
    write_function: "كتابة كود",
    debug_code: "تصحيح كود",
    code_review: "مراجعة كود",
    analyze_data: "تحليل بيانات",
    clean_data: "تنظيف بيانات",
    review_comments: "مراجعة تعليقات",
    review_document: "مراجعة وثيقة",
    ux_problem: "مشكلة UX",
    stakeholder_notes: "اجتماع أصحاب المصلحة",
};

const getScoreColor = (score: number) => {
    if (score >= 75) return "var(--color-teal)";
    if (score >= 55) return "var(--color-gold)";
    return "var(--color-text-muted)";
};

function AdminSimulationsSection() {
    const [simulations, setSimulations] = useState<AdminSimulation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "completed" | "in_progress">("all");

    useEffect(() => {
        adminService
            .getSimulations()
            .then(setSimulations)
            .finally(() => setLoading(false));
    }, []);

    const filtered = simulations.filter((s) => {
        if (filter === "all") return true;
        return s.status === filter;
    });

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-[26px] font-bold text-bg-dark-secondary">{LABELS.heading}</h1>

                {/* Filter tabs */}
                <div className="flex gap-1 bg-bg-card-secondary rounded-[10px] p-1">
                    {(["all", "completed", "in_progress"] as const).map((key) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`text-[12px] font-bold px-4 py-1.5 rounded-[8px] transition border-0 cursor-pointer ${filter === key
                                    ? "bg-bg-dark text-text-on-dark"
                                    : "bg-transparent text-text-muted hover:text-bg-dark-secondary"
                                }`}
                        >
                            {key === "all" ? "الكل" : key === "completed" ? "مكتملة" : "جارية"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-bg-card rounded-[20px] shadow-[0_10px_30px_rgba(26,58,74,0.06)] overflow-hidden">

                {/* Table header */}
                <div className="grid grid-cols-[1fr_1fr_1fr_100px_100px_80px] gap-4 px-6 py-3 border-b border-teal-pale bg-bg-light-secondary/60">
                    {["المستخدم", "المجال", "المهمة", "النوع", "النتيجة", "الحالة"].map((col) => (
                        <span key={col} className="text-[11px] font-bold text-text-muted uppercase tracking-wide text-right">
                            {col}
                        </span>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center text-text-muted text-sm py-10">جارٍ التحميل...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center text-text-muted text-sm py-10">{LABELS.noData}</div>
                ) : (
                    filtered.map((sim) => {
                        const score = sim.fitPercent ?? sim.score ?? 0;
                        const color = getScoreColor(score);
                        const date = sim.completedAt
                            ? new Date(sim.completedAt).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" })
                            : new Date(sim.startedAt).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" });

                        return (
                            <div
                                key={sim.simulationId}
                                className="grid grid-cols-[1fr_1fr_1fr_100px_100px_80px] gap-4 items-center px-6 py-4 border-b last:border-0 border-teal-pale hover:bg-bg-light-secondary/40 transition"
                            >
                                {/* User */}
                                <div className="text-right min-w-0">
                                    {sim.user ? (
                                        <>
                                            <div className="text-[13px] font-bold text-bg-dark-secondary truncate">{sim.user.name}</div>
                                            <div className="text-[11px] text-text-muted truncate">{sim.user.email}</div>
                                        </>
                                    ) : (
                                        <span className="text-[12px] text-text-muted italic">{LABELS.anonymous}</span>
                                    )}
                                </div>

                                {/* Job */}
                                <div className="text-[13px] font-medium text-bg-dark-secondary text-right truncate">
                                    {sim.jobTitleAr || "—"}
                                </div>

                                {/* Task */}
                                <div className="text-[13px] text-text-muted text-right truncate">
                                    {sim.taskTitle || "—"}
                                </div>

                                {/* Type badge */}
                                <div className="text-right">
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal/10 text-teal border border-teal/20 whitespace-nowrap">
                                        {TASK_TYPE_LABELS[sim.taskType] ?? sim.taskType}
                                    </span>
                                </div>

                                {/* Score */}
                                <div className="flex items-center gap-2 justify-end">
                                    {sim.status === "completed" && score > 0 ? (
                                        <>
                                            <div className="w-16 h-1.5 bg-bg-card-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{ width: `${score}%`, background: color }}
                                                />
                                            </div>
                                            <span className="text-[12px] font-bold w-8 text-right" style={{ color }}>
                                                {score}%
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-[12px] text-text-muted">—</span>
                                    )}
                                </div>

                                {/* Status + date */}
                                <div className="flex flex-col items-end gap-1">
                                    <span
                                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${sim.status === "completed"
                                                ? "bg-teal/10 text-teal"
                                                : "bg-gold/10 text-gold"
                                            }`}
                                    >
                                        {sim.status === "completed" ? LABELS.completed : LABELS.inProgress}
                                    </span>
                                    <span className="text-[10px] text-text-muted">{date}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}

export default AdminSimulationsSection;