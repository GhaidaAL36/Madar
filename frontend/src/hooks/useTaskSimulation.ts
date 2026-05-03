// I will delete it when api
import type { SimulationTask } from "../types/SimulationTask";
import { jobs } from "../data/jobsData";

export function useTaskSimulation(jobId: string, taskId: string): SimulationTask | null {
  const job = jobs.find((j) => j.id === jobId);
  const task = job?.tasks.find((t) => String(t.id) === taskId); // ← fix id mismatch
  if (!task) return null;

  return {
    id: String(task.id),
    type: task.type, 
    title: task.title,
    fullDescription: task.description,
    expectations: [
      { id: "1", label: "تحديد نوع الخطأ (منطقي / نحوي / وقت تشغيل)", completed: true  },
      { id: "2", label: "تحديد السطر الذي يحتوي الخطأ بدقة",           completed: true  },
      { id: "3", label: "كتابة الكود المُصحَّح",                        completed: false },
      { id: "4", label: "تفسير سبب الخطأ وكيفية تجنبه مستقبلاً",       completed: false },
    ],
    evaluationCriteria: [
      { id: "c1", label: "دقة تشخيص المشكلة"           },
      { id: "c2", label: "صحة الحل المقترح"             },
      { id: "c3", label: "وضوح التفسير والمنطق"         },
      { id: "c4", label: "سرعة الاستجابة وطريقة التفكير" },
    ],
  };
}