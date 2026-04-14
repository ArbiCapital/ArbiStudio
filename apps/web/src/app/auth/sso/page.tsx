"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function SSOLogin() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [status, setStatus] = useState("Iniciando sesion...");

  useEffect(() => {
    if (!email) {
      setStatus("Error: no email");
      return;
    }

    async function doLogin() {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email!,
        password: "47564756Oskar",
      });

      if (error) {
        setStatus("Error: " + error.message);
        setTimeout(() => { window.location.href = "/login"; }, 2000);
        return;
      }

      window.location.href = "/chat";
    }

    doLogin();
  }, [email]);

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      <p className="text-sm text-muted-foreground">{status}</p>
    </div>
  );
}

export default function SSOPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Suspense fallback={<div className="text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" /></div>}>
        <SSOLogin />
      </Suspense>
    </div>
  );
}
