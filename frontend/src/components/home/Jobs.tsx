import { Link } from "react-router-dom";
import { jobs, type Job } from "../../types/Job";

interface Props {
  jobs: Job[];
}

function Jobs({}: Props) {
  return (
    <section className="px-20 py-25 bg-bg-light" id="jobs">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-teal bg-[rgba(46,125,140,0.08)] border border-[rgba(46,125,140,0.15)] rounded-full px-3.5 py-1.25 mb-4">
          استكشف المهن
        </span>
        <h2 className="text-[40px] font-bold text-bg-dark-secondary leading-tight mb-3.5">
          أي المجالات يناسبك؟
        </h2>
        <p className="text-[17px] text-bg-dark-secondary/55 max-w-120 mx-auto leading-[1.7]">
          تصفح المهن حسب القطاع وابدأ المحاكاة في أي وقت
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
                i % 2 === 0 ? "bg-teal/10" : "bg-bg-light-secondary"
              }`}
            >
              {job.icon}
            </div>
            <div className="text-[16px] font-bold text-bg-dark-secondary mb-1">
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
