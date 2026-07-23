"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
      
      if (!token && !isAuthRoute && pathname !== "/") {
        router.push("/login");
      } else if (token && (isAuthRoute || pathname === "/")) {
        router.push("/dashboard");
      }
    }
  }, [token, mounted, pathname, router]);

  if (!mounted) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
