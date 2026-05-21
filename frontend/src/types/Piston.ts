// src/types/Piston.ts

export interface PistonFile {
  name?: string;
  content: string;
}

export interface PistonRequest {
  language: string;
  version: string;
  files: PistonFile[];
  stdin?: string;
}

export interface PistonRunResult {
  stdout: string;
  stderr: string;
  code: number | null;
  signal: string | null;
  output: string;
}

export interface PistonResponse {
  language: string;
  version: string;
  run: PistonRunResult;
  compile?: PistonRunResult; // only present for compiled languages (Java, C++)
}

export type SupportedLanguage = "javascript" | "python";

export interface LanguageConfig {
  label: string;           // display name
  language: string;        // piston language string
  version: string;         // piston version string
  defaultFile: string;     // default filename
  monacoLanguage: string;  // monaco editor language id
  starterCode: string;     // shown before AI generates code
}