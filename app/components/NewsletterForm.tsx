"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "../lib/newsletter";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    const result = await subscribeToNewsletter(email);
    if (result.ok) {
      setStatus({ kind: "success" });
    } else {
      setStatus({ kind: "error", message: result.error });
    }
  }

  if (status.kind === "success") {
    return (
      <p className="mt-3 text-base text-ink/70">
        Thanks — you&apos;re on the list.
      </p>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          disabled={status.kind === "submitting"}
          className="min-w-0 flex-1 border border-ink/15 bg-bright px-3 py-2 text-base focus:outline-none focus:ring-1 focus:ring-ink disabled:bg-ink/5"
        />
        <button
          type="submit"
          disabled={status.kind === "submitting"}
          className="bg-ink px-4 py-2 text-base text-bright hover:bg-ink/80 disabled:cursor-not-allowed disabled:bg-ink/30"
        >
          {status.kind === "submitting" ? "…" : "Sign up"}
        </button>
      </form>
      {status.kind === "error" && (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {status.message}
        </p>
      )}
    </>
  );
}
