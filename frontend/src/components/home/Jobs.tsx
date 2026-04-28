import { Link } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs"; // remove when api ready
// import { useJobs } from "../../hooks/useJobsApi"; - import when api ready

const LABELS = {
  explore: "استكشف المهن",
  heading: "أي المجالات يناسبك؟",
  subheading: "تصفح المهن حسب القطاع وابدأ المحاكاة في أي وقت",
} as const;

function Jobs() {
  const jobs = useJobs();

  return (
    <section className="px-20 py-25 bg-bg-light" id="jobs">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-teal bg-teal/8 border border-teal/15 rounded-full px-3.5 py-1.5 mb-4">
          {LABELS.explore}
        </span>
        <h2 className="text-[40px] font-bold text-text-primary leading-tight mb-3.5">
          {LABELS.heading}
        </h2>
        <p className="text-[17px] text-text-muted max-w-120 mx-auto leading-[1.7]">
          {LABELS.subheading}
        </p>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {jobs.map((job, i) => (
          <Link
            key={job.id}
            to={`/jobs/${job.id}`}
            className="group bg-bg-card rounded-[20px] px-6 py-7 no-underline block transition-all duration-250 hover:-translate-y-0.75 hover:border-teal hover:shadow-[0_12px_32px_rgba(46,125,140,0.1)]"
          >
            <div
              className={`w-12 h-12 rounded-sm flex items-center justify-center text-[22px] mb-4 ${
                i % 2 === 0 ? "bg-teal/10" : "bg-bg-card-secondary"
              }`}
            >
              {job.icon}
            </div>
            <div className="text-[16px] font-bold text-text-primary mb-1">
              {job.titleAr}
            </div>
            <div className="hidden text-[18px] text-teal mt-3 group-hover:block">
              ←
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Jobs;
