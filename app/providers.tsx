'use client'

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useRouter, usePathname } from "next/navigation"
import { httpService } from "@/lib/services"
import { UserProfile } from "@/types/auth"

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }));

  const router = useRouter();
  const pathname = usePathname();

  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  // Load theme and token on mount
  React.useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Default to light
      document.documentElement.classList.remove("dark");
    }

    // Auth Token
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      setToken(savedToken);
      fetchProfile(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = async (authToken: string) => {
    setIsLoading(true);
    try {
      const data = await httpService.getMe();
      if (data?.status === "success" && data?.data) {
        setUser(data.data);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newToken: string) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
    await fetchProfile(newToken);
  };

  const logout = React.useCallback(() => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
    setIsLoading(false);
    router.push("/");
  }, [router]);

  const refreshProfile = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Routing Guard / Middleware
  React.useEffect(() => {
    if (isLoading) return;

    const publicRoutes = ["/", "/register", "/login"];
    const isPublic = publicRoutes.includes(pathname);

    if (token && user) {
      // Redirect authenticated users trying to access login/register
      if (isPublic) {
        router.push("/dashboard");
      }

      // Role guards
      // if (pathname.startsWith("/users") && user.role !== "SUPERADMIN") {
      //   router.push("/dashboard");
      // }

    } else {
      // Redirect guests trying to access protected paths
      if (!isPublic) {
        router.push("/");
      }
    }
  }, [pathname, token, user, isLoading, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, refreshProfile }}>
          {children}
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
