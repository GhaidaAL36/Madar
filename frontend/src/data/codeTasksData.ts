import type { CodeTaskData } from "../types/CodeTask";
import type { TaskType } from "../types/Job";

// Starter code templates per task type
const STARTER_CODE: Record<TaskType, string> = {
  "write-code": `# مهمتك: اكتب دالة تحسب المتوسط الحسابي لقائمة من الأرقام
# المدخلات: قائمة من الأرقام (list of numbers)
# المخرجات: المتوسط الحسابي (float)
# تذكر: تعامل مع حالة القائمة الفارغة

def calculate_average(numbers):
    # اكتب الكود هنا
    pass


# مثال على الاستخدام:
# calculate_average([1, 2, 3, 4, 5])  →  3.0
# calculate_average([])               →  0.0
`,

  "fix-code": `# هذا الكود يحتوي على خطأ منطقي — شخّص المشكلة وأصلحها

def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)


def find_max(numbers):
    max_val = 0
    for num in numbers:
        if num > max_val:
            max_val = num
    return max_val


# اختبار
print(calculate_average([10, 20, 30]))   # يجب أن يطبع: 20.0
print(calculate_average([]))             # ماذا يحدث هنا؟
print(find_max([-5, -3, -1]))            # يجب أن يطبع: -1
`,

  "clean-code": `# هذا الكود يعمل بشكل صحيح لكنه يحتاج إلى تحسين — نظّفه واجعله أوضح

def x(l):
    t=0
    for i in l:
        t=t+i
    if len(l)==0:
        return 0
    return t/len(l)

def y(l):
    m=l[0]
    for i in l:
        if i>m:
            m=i
    return m

def z(l,v):
    r=[]
    for i in l:
        if i!=v:
            r.append(i)
    return r

# اختبار
print(x([1,2,3,4,5]))
print(y([3,1,4,1,5,9,2,6]))
print(z([1,2,3,2,4,2],2))
`,
};

const HINTS: Record<TaskType, string[]> = {
  "write-code": [
    "استخدم sum() و len() للحساب المباشر",
    "تحقق من القائمة الفارغة قبل القسمة لتجنب ZeroDivisionError",
    "يمكنك كتابتها في سطر واحد: return sum(numbers) / len(numbers) if numbers else 0.0",
  ],
  "fix-code": [
    "جرّب تشغيل الكود بقائمة فارغة — ماذا يحدث؟",
    "الخطأ الأول: القسمة على صفر عند قائمة فارغة في calculate_average",
    "الخطأ الثاني: find_max يبدأ من 0 وليس من أول عنصر — يفشل مع الأرقام السالبة",
  ],
  "clean-code": [
    "أسماء الدوال يجب أن تصف ما تفعله: x → calculate_average",
    "أضف docstring لكل دالة لتوضيح المدخلات والمخرجات",
    "استخدم مسافات حول العمليات الحسابية لتحسين القراءة",
  ],
};

const INSTRUCTIONS: Record<TaskType, string> = {
  "write-code":
    "اكتب دالة Python تحسب المتوسط الحسابي لقائمة من الأرقام. يجب أن تتعامل مع القائمة الفارغة بإرجاع 0.0، وتعمل مع الأرقام الصحيحة والعشرية.",
  "fix-code":
    "الكود التالي يحتوي على أخطاء منطقية تجعله يعطي نتائج خاطئة في حالات معينة. اقرأ الكود بعناية، حدّد الأخطاء، وأصلحها مع شرح سبب كل خطأ.",
  "clean-code":
    "الكود التالي يعمل بشكل صحيح لكنه مكتوب بشكل سيّئ — أسماء غير معبّرة، لا توثيق، وتنسيق ضعيف. أعد كتابته بشكل نظيف مع الحفاظ على نفس السلوك.",
};

const EXPECTED_OUTPUT: Record<TaskType, string> = {
  "write-code": "3.0\n0.0",
  "fix-code":   "20.0\n0.0\n-1",
  "clean-code": "3.0\n9\n[1, 3, 4]",
};

// TODO: swap with API call when backend is ready
export function getCodeTaskData(taskType: TaskType): CodeTaskData {
  return {
    taskType,
    language: "python",
    instructions: INSTRUCTIONS[taskType],
    starterCode:  STARTER_CODE[taskType],
    hints:        HINTS[taskType],
    expectedOutput: EXPECTED_OUTPUT[taskType],
  };
}