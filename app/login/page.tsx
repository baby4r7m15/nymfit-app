"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  async function signIn() {
    await supabase.auth.signInWithOtp({
      email,
    });
    alert("Check your email for login link.");
  }

  return (
    <div className="container section">
      <div className="card" style={{ maxWidth: 420, margin: "auto" }}>

        <h2>ACCESS SYSTEM</h2>

        <p>Login to NymFit</p>

        <input
          placeholder="email@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            marginTop: 20,
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,.03)",
            color: "white"
          }}
        />

        <button
          className="button button-primary"
          style={{ marginTop: 20, width: "100%" }}
          onClick={signIn}
        >
          SEND LINK
        </button>

      </div>
    </div>
  );
}
