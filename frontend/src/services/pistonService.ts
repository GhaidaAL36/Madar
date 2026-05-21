// src/services/pistonService.ts

import type {
  PistonRequest,
  PistonResponse,
  SupportedLanguage,
  LanguageConfig,
} from "../types/Piston";

const BASE_URL = "https://emkc.org/api/v2/piston";

// ─── Language Registry ────────────────────────────────────────────────────────
// To add a new language later, just add a new entry here.
// Get exact version strings from: GET https://emkc.org/api/v2/piston/runtimes

export const LANGUAGE_CONFIG: Record<SupportedLanguage, LanguageConfig> = {
  javascript: {
    label: "JavaScript",
    language: "javascript",
    version: "18.15.0",
    defaultFile: "index.js",
    monacoLanguage: "javascript",
    starterCode: "// اكتب الكود هنا\n",
  },
  python: {
    label: "Python",
    language: "python",
    version: "3.10.0",
    defaultFile: "main.py",
    monacoLanguage: "python",
    starterCode: "# اكتب الكود هنا\n",
  },
  // ─── Adding a new language is this simple ───
  // typescript: {
  //   label: "TypeScript",
  //   language: "typescript",
  //   version: "5.0.3",
  //   defaultFile: "index.ts",
  //   monacoLanguage: "typescript",
  //   starterCode: "// اكتب الكود هنا\n",
  // },
};

export const SUPPORTED_LANGUAGES = Object.keys(
  LANGUAGE_CONFIG
) as SupportedLanguage[];

// ─── Execute Code ─────────────────────────────────────────────────────────────

export async function executeCode(
  language: SupportedLanguage,
  code: string,
  stdin = ""
): Promise<PistonResponse> {
  const config = LANGUAGE_CONFIG[language];

  const payload: PistonRequest = {
    language: config.language,
    version: config.version,
    files: [{ name: config.defaultFile, content: code }],
    stdin,
  };

  const res = await fetch(`${BASE_URL}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Piston API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<PistonResponse>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true if code ran with no errors */
export function isSuccess(response: PistonResponse): boolean {
  const compileError = response.compile?.stderr;
  const runtimeError = response.run.stderr;
  return !compileError && !runtimeError && response.run.code === 0;
}

/** Returns the error message (compile error takes priority over runtime) */
export function getError(response: PistonResponse): string | null {
  if (response.compile?.stderr) return response.compile.stderr;
  if (response.run.stderr) return response.run.stderr;
  return null;
}

/** Returns clean stdout output */
export function getOutput(response: PistonResponse): string {
  return response.run.stdout || "";
}