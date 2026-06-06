"use client";

import { MockAuthProvider } from "@/context/MockAuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <MockAuthProvider>{children}</MockAuthProvider>;
}
