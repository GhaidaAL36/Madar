import type { Job } from "../../types/Job";

interface Props {
  job: Job;
}

const JobHeader = ({ job }: Props) => {
  return (
    <section
      dir="ltr"
      className="w-full min-h-120 mt-10 bg-bg-dark px-10 py-12 flex flex-row-reverse items-start gap-10"
    >
      {/* Right Column — Title + Description */}
      <div className="flex-1 flex flex-col items-end gap-3 pt-1">
        {/* Icon */}
        <div className="w-16 h-16 rounded-md border border-teal bg-bg-dark-mid flex items-center justify-center mb-1">
          <span className="text-2xl">{job.icon}</span>
        </div>

        {/* Arabic Title */}
        <h1 className="text-text-on-dark text-4xl font-bold leading-tight text-right">
          {job.titleAr}
        </h1>

        {/* English Subtitle */}
        <p className="text-text-muted text-sm tracking-wide">{job.titleEn}</p>

        {/* Primary Description */}
        <p className="text-text-on-dark text-sm leading-relaxed text-right max-w-140">
          {job.descriptionPrimary}
        </p>

        {/* Secondary Description */}
        <p className="text-text-on-dark text-sm leading-relaxed text-right max-w-140">
          {job.descriptionSecondary}
        </p>
      </div>
      {/* Left Column — Skills Card + Match Badge */}
      <div className="flex flex-col gap-4 shrink-0 w-85">
        {/* Skills Card */}
        <div className="bg-bg-light rounded-md overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-b border-teal-pale">
            <span className="text-text-primary font-semibold text-sm">
              المهارات المطلوبة
            </span>
            <div className="w-5 h-5 rounded-xl border border-teal-light flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-light" />
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 gap-3 p-5">
            {job.skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-end gap-2">
                <span className="bg-white border border-teal-pale rounded-lg px-3 py-1.5 text-text-primary text-xs font-medium text-right leading-relaxed">
                  {skill}
                </span>
                <span className="w-2 h-2 rounded-full bg-teal shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobHeader;
