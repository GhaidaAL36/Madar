import { Link } from "react-router-dom";
import { useJobs } from "../../hooks/useJobsApi";

const LABELS = {
  explore: "استكشف المجالات",
  heading: "أي المجالات يناسبك؟",
  subheading: "تصفح المهن وابدأ المهام",
} as const;

function Jobs() {
    const { jobs, loading, error } = useJobs(); // ← destructure correctly

  if (loading) return <div className="min-h-screen flex items-center justify-center text-text-muted">جارٍ التحميل...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <section className="bg-bg-light px-20 py-25" id="jobs">
      <div className="mb-16 text-center">
        <span className="mb-4 inline-block rounded-full border border-teal/15 bg-teal/8 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-teal">
          {LABELS.explore}
        </span>

        <h2 className="mb-3.5 text-[40px] font-bold leading-tight text-text-primary">
          {LABELS.heading}
        </h2>

        <p className="mx-auto max-w-120 text-[17px] leading-[1.7] text-text-muted">
          {LABELS.subheading}
        </p>
      </div>

      <div className="mb-10 grid grid-cols-4 gap-4">
        {jobs.map((job, index) => (
          <Link
            key={job.id}
            to={`/jobs/${job.id}`}
            className="group block rounded-[20px] border border-transparent bg-bg-card px-6 py-7 no-underline transition-all duration-250 hover:-translate-y-0.75 hover:border-teal hover:shadow-[0_12px_32px_rgba(46,125,140,0.1)]"
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-sm text-[22px] ${
                index % 2 === 0 ? "bg-teal/10" : "bg-sand/80"
              }`}
            >
              {job.icon}
            </div>

            <div className="mb-1 text-[16px] font-bold text-text-primary">
              {job.titleAr}
            </div>

            <div className="mt-3 text-[18px] text-teal opacity-0 transition-opacity group-hover:opacity-100">
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Jobs;
