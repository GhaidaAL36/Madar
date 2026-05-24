import { useEffect, useState } from "react";
import { profileService } from "../services/profileService";
import type { Profile, SimulationHistory } from "../types/profile";

interface UseProfileResult {
  user: { name: string; email: string; initials: string };
  profileInterests: string[];
  loading: boolean;
  error: string | null;
}

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profileService
      .getProfile()
      .then(setProfile)
      .catch(() => setError("فشل تحميل الملف الشخصي"))
      .finally(() => setLoading(false));
  }, []);

  return {
    user: {
      name: profile?.name ?? "",
      email: profile?.email ?? "",
      initials: profile?.name
        ? profile.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "",
    },
    profileInterests: profile?.interests ?? [],
    loading,
    error,
  };
}

interface UseProfileHistoryResult {
  history: SimulationHistory[];
  loading: boolean;
  error: string | null;
}

export function useProfileHistory(): UseProfileHistoryResult {
  const [history, setHistory] = useState<SimulationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profileService
      .getHistory()
      .then(setHistory)
      .catch(() => setError("فشل تحميل السجل"))
      .finally(() => setLoading(false));
  }, []);

  return { history, loading, error };
}