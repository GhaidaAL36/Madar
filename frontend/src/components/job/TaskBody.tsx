import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Task, TaskType } from "../../types/Job";

const LABELS = {
  interactiveTasks: "المهام التفاعلية",
  startTask: "ابدأ المهمة",
} as const;

interface TaskMeta {
  description: string;
}

const TASK_META: Record<string, TaskMeta> = {
  "debug-code": {
    description: "أحياناً الكود لا يعطي النتيجة الصحيحة بسبب خطأ صغير يسمى Bug. مهمتك هي قراءة الكود بعناية، فهم ما يفترض أن يفعله، ثم تحديد السطر الخاطئ وتصحيحه. مثال: لو كتبنا return total بدلاً من return average، النتيجة ستكون خاطئة تماماً.",
  },
  "write-function": {
    description: "الـ Function هي مجموعة أسطر من الكود تقوم بمهمة محددة ويمكن استخدامها أكثر من مرة. تبدأ بكلمة def ثم اسم الدالة ثم المدخلات بين قوسين. مثال: def calculate_average(numbers): تأخذ قائمة أرقام وترجع متوسطها.",
  },
  "code-review": {
    description: "عندما يكتب مطور كوداً، يقرأه مطور آخر للتأكد من أنه صحيح ونظيف وسهل الفهم. في هذه المهمة ستقرأ كود شخص آخر وتكتب ملاحظاتك عليه مثل: هل الأسماء واضحة؟ هل هناك حالات لم يتم التعامل معها؟",
  },

  "review-comments": {
    description: "مدير المنتج يراقب باستمرار ما يقوله المستخدمون عن المنتج. مهمتك هي قراءة التعليقات، تحديد الأنماط المتكررة، وترتيب المشاكل حسب الأولوية. مثال: إذا شكا 5 مستخدمين من نفس المشكلة في صفحة الدفع، هذه أولوية أعلى من طلب ميزة جديدة.",
  },
  "review-document": {
    description: "الـ PRD أو Product Requirements Document هي وثيقة تصف ميزة جديدة بالتفصيل. مهمة مدير المنتج هي التأكد من أن المتطلبات واضحة وقابلة للقياس وغير متعارضة. مثال: متطلب يقول «النظام يجب أن يكون سريعاً» غير كافٍ — يجب أن يقول «يجب أن يتحمل النظام 1000 مستخدم في نفس الوقت».",
  },
  "ux-problem": {
    description: "عندما تكون نسبة إتمام عملية ما منخفضة، مدير المنتج يحلل رحلة المستخدم لتحديد أين تكمن المشكلة. مهمتك هي تعريف المشكلة بوضوح، تحديد السبب الجذري، واقتراح حلول مع ترتيبها حسب الأولوية.",
  },
  "stakeholder-notes": {
    description: "في كل شركة هناك أطراف مختلفة لكل منها أولوياتها. مدير المنتج يجب أن يوازن بين هذه الطلبات المتعارضة ويتخذ قرارات مبنية على قيمة المستخدم والبيانات.",
  },

  "data-analyst": {
    description: "البيانات في الواقع دائماً تكون غير مرتبة، فيها قيم مفقودة تسمى null أو None، وفيها تكرارات، وأحياناً أرقام خاطئة. مهمتك هي فحص هذه البيانات وتنظيفها وتحليلها لاستخلاص رؤى واضحة وقابلة للتطبيق.",
  },
  "clean-data": {
    description: "البيانات في الواقع دائماً تكون غير مرتبة، فيها قيم مفقودة تسمى null أو None، وفيها تكرارات، وأحياناً أرقام خاطئة. مهمتك هي فحص هذه البيانات وتنظيفها قبل أي تحليل.",
  },
};

interface Props {
  tasks: Task[];
}

const TaskBody = ({ tasks }: Props) => {
  const [activeTaskId, setActiveTaskId] = useState(tasks[0]?.id);
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? tasks[0];

  if (!activeTask) return null;

  const meta = TASK_META[activeTask.type as TaskType];
  console.log(tasks.map(t => ({ id: t.id, type: t.type })));

  return (
    <div dir="rtl" className="min-h-screen bg-bg-light flex">

      <aside className="w-55 border-l border-teal-pale bg-bg-light shrink-0 py-8 px-5 flex flex-col gap-1">
        <p className="text-text-muted text-xs mb-4">{LABELS.interactiveTasks}</p>
        {tasks.map((task) => {
          const isActive = task.id === activeTaskId;
          return (
            <div
              key={task.id}
              onClick={() => setActiveTaskId(task.id)}
              className={`flex flex-col items-start gap-0.5 py-3 px-3 rounded-lg cursor-pointer transition-colors ${isActive ? "bg-bg-card shadow-sm" : "hover:bg-bg-card/60"
                }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-xl shrink-0 ${isActive ? "bg-teal" : "bg-teal-pale"}`} />
                <span className={`text-xs font-semibold ${isActive ? "text-bg-dark-secondary" : "text-text-muted"}`}>
                  {task.title}
                </span>
              </div>
              <span className="text-[10px] text-text-muted pr-4">{task.duration}</span>
              {isActive && <div className="w-full h-0.5 bg-bg-dark-secondary rounded-full mt-1" />}
            </div>
          );
        })}
      </aside>

      <main className="flex-1 py-10 px-14 flex flex-col gap-8">
        <div className="flex flex-col items-start gap-2 border-b border-teal-pale pb-6">
          <p className="text-text-muted text-xs">{LABELS.interactiveTasks}</p>
          <div className="flex items-center gap-3">
            <h1 className="text-bg-dark-secondary text-4xl font-bold">{activeTask.title}</h1>
          </div>
          <div className="flex items-center gap-1 text-text-muted text-xs mt-1">
            <span><i className="fa-regular fa-clock" /></span>
            <span>{activeTask.duration}</span>
          </div>
        </div>

        {meta && (
          <div className="flex flex-col gap-5 border-b border-teal-pale pb-6">
            <p className="text-text-secondary text-sm leading-relaxed">{meta.description}</p>
            <div className="flex flex-col gap-2">
            </div>
          </div>
        )}
        

        <div className="flex justify-start mt-2">
          <button
            onClick={() => navigate(`/jobs/${jobId}/tasks/${activeTask.id}`)}
            className="cursor-pointer rounded-xl bg-gold-dark px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-gold"
          >
            {LABELS.startTask}
          </button>
        </div>
      </main>
    </div>
    
  );

};

export default TaskBody;