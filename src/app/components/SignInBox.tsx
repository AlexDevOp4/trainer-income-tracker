"use client";
import { useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

export function SignInBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
      return;
    }
    // session cookies are set by the browser client; same-origin API calls will receive them
    location.reload(); // simplest way to propagate session to server routes
  }

  return (
    <form onSubmit={handleSignIn} className="flex gap-2">
      <input
        type="email"
        placeholder="email"
        className="border px-2 py-1 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        className="border px-2 py-1 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-indigo-600 text-white px-3 py-1 rounded" type="submit">
        Sign in
      </button>
    </form>
  );
}
