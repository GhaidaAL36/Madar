export function simulateRun(code: string, expectedOutput: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (code.trim() === "" || code.includes(">>>")) {
        resolve("SyntaxError: invalid syntax");
        return;
      }
      if (code.includes("pass") && !code.includes("# اكتب الكود هنا")) {
        resolve("None");
        return;
      }
      resolve(expectedOutput);
    }, 1200);
  });
}

/* 
i will use it when api ready
import { codeService } from "../services/codeService";

export async function simulateRun(jobId: string, taskId: string, code: string): Promise<string> {
  return codeService.run(jobId, taskId, code); // real execution
}
*/