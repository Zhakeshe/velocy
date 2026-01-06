"use client";

import React from "react";
import { AuthProvider } from "@/lib/hooks/auth-context";
import { LocaleProvider } from "@/lib/hooks/locale-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <AuthProvider>{children}</AuthProvider>
    </LocaleProvider>
  );
}
