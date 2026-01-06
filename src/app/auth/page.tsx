import React, { Suspense } from "react";

import AuthInner from "./auth-inner";

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthInner />
    </Suspense>
  );
}
