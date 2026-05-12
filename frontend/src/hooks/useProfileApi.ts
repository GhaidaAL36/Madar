import { useEffect, useState } from "react";
import { profileService } from "../services/profileService";
import type { Profile, Simulation } from "../types/profile";

interface UseProfileResult {
  user: { name: string; email: string; initials: string };
  interests: string[];
  simulations: Simulation[];
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
      .then((data) => {
        setProfile(data);
      })
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
    interests: profile?.interests ?? [],
    simulations: profile?.simulations ?? [],
    loading,
    error,
  };
}