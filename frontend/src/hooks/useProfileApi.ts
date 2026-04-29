import { useEffect, useState } from "react";
import { profileService } from "../services/profileService";
import type { Profile } from "../types/profile";

interface UseProfileResult {
  profile: Profile | null;
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

  return { profile, loading, error };
}