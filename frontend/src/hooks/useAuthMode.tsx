import { useSearchParams } from "react-router-dom";
import type { AuthMode } from "../types/auth";

export function useAuthMode(): AuthMode {
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode");

  return mode === "signup" ? "signup" : "login";
}