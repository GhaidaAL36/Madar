import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useProfile } from "../hooks/useProfileApi";
import type { Simulation } from "../types/profile";

const LABELS = {
  editProfile: "تعديل الملف",
  interests: "الاهتمامات",
  addInterest: "+ إضافة",
  simulationHistory: "سجل المحاكاة",
} as const;

const getMatchColor = (match: number): string => {
  if (match >= 75) return "var(--color-teal)";
  if (match >= 55) return "var(--color-gold)";
  return "var(--color-text-muted)";
};

const SimulationCard = ({ sim }: { sim: Simulation }) => {
  const color = getMatchColor(sim.match);
  return (
    <div className="flex items-center justify-between bg-bg-card-secondary rounded-[16px] px-5 py-4 transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_30px_rgba(46,125,140,0.12)]">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-[10px] bg-teal/10 flex items-center justify-center text-[20px]">
          {sim.icon}
        </div>
        <span className="text-[15px] font-bold text-bg-dark-secondary">
          {sim.job}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-28 h-2 bg-bg-card rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${sim.match}%`, background: color }}
          />
        </div>
        <span
          className="text-[14px] font-bold w-10 text-left"
          style={{ color }}
        >
          {sim.match}%
        </span>
      </div>
    </div>
  );
};

function ProfilePage() {
  const { user, interests, simulations, loading, error } = useProfile();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-text-muted">جارٍ التحميل...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bg-light-secondary pt-24 pb-16 px-6">
        <div className="max-w-215 mx-auto flex flex-col gap-10">
          {/* Profile Card */}
          <div className="bg-bg-dark text-text-on-dark rounded-3xl px-8 py-8 flex items-center justify-between shadow-[0_20px_60px_rgba(15,37,48,0.25)]">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-white/10 text-text-on-dark text-[22px] font-bold flex items-center justify-center">
                {user.initials}
              </div>
              <div>
                <div className="text-[20px] font-bold mb-1">{user.name}</div>
                <div className="text-[14px] text-text-on-dark/70">
                  {user.email}
                </div>
              </div>
            </div>
            <button className="text-[13px] font-bold text-text-on-dark/80 bg-white/10 border border-white/15 rounded-[10px] px-5 py-2 transition-all duration-200 hover:bg-white/20 hover:text-text-on-dark">
              {LABELS.editProfile}
            </button>
          </div>

          {/* Interests */}
          <div className="bg-bg-card rounded-[20px] px-8 py-7 shadow-[0_8px_24px_rgba(26,58,74,0.06)]">
            <div className="text-[13px] font-bold text-bg-dark-secondary mb-5 uppercase tracking-[0.08em]">
              {LABELS.interests}
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((tag) => (
                <span
                  key={tag}
                  className="text-[13px] font-medium text-teal bg-bg-card-secondary rounded-full px-4 py-1.5 cursor-pointer transition-all duration-200 hover:bg-teal hover:text-white"
                >
                  {tag}
                </span>
              ))}
              <button className="text-[13px] font-medium text-text-muted border border-dashed border-teal-pale rounded-full px-4 py-1.5 transition-all duration-200 hover:border-teal hover:text-teal">
                {LABELS.addInterest}
              </button>
            </div>
          </div>

          {/* Simulation History */}
          <div className="bg-bg-card rounded-[20px] px-8 py-7 shadow-[0_8px_24px_rgba(26,58,74,0.06)]">
            <div className="text-[13px] font-bold text-bg-dark-secondary mb-6 uppercase tracking-[0.08em]">
              {LABELS.simulationHistory}
            </div>
            <div className="flex flex-col gap-4">
              {simulations.map((sim) => (
                <SimulationCard key={sim.job} sim={sim} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProfilePage;
