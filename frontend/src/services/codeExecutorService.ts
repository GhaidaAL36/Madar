// src/services/codeExecutorService.ts

const BASE_URL = "https://onecompiler.com/api/v1/run"
const API_KEY = import.meta.env.VITE_ONECOMPILER_KEY;

export const LANGUAGE_CONFIG = {
  javascript: {
    label: "JavaScript",
    monacoLanguage: "javascript",
    starterCode: "// اكتب الكود هنا\n",
    defaultFile: "solution.js",
  },
  python: {
    label: "Python",
    monacoLanguage: "python",
    starterCode: "# اكتب الكود هنا\n",
    defaultFile: "solution.py",
  },
} as const;

export type SupportedLanguage = keyof typeof LANGUAGE_CONFIG;
export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_CONFIG) as SupportedLanguage[];

export interface RunResult {
  stdout: string;
  stderr: string | null;
  exception: string | null;
  status: string;
}

export async function executeCode(
  language: SupportedLanguage,
  code: string,
  stdin = ""
): Promise<RunResult> {
  const config = LANGUAGE_CONFIG[language];

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({
      language,
      stdin,
      files: [{ name: config.defaultFile, content: code }],
    }),
  });

  if (!res.ok) throw new Error(`OneCompiler error: ${res.status}`);
  return res.json() as Promise<RunResult>;
}

export function isSuccess(result: RunResult): boolean {
  return result.status === "success" && !result.exception;
}

export function getOutput(result: RunResult): string {
  return result.stdout ?? "";
}

export function getError(result: RunResult): string | null {
  if (result.exception) return result.exception;
  if (result.stderr) return result.stderr;
  return null;
}