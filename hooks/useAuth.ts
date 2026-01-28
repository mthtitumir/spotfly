import { useCallback, useEffect, useState } from "react";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load token from localStorage on mount
    const savedToken = localStorage.getItem("token");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(savedToken);
    setIsLoading(false);
  }, []);

  const setAuthToken = useCallback((newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem("token");
      setToken(null);
    }
  }, []);

  return {
    token,
    setAuthToken,
    isLoading,
    isAuthenticated: !!token,
  };
};
