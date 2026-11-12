"use client";

import { useActionState, useId } from "react";
import { subscribe } from "@/lib/actions";

export function SignupForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [state, action, pending] = useActionState(subscribe, null);
  const id = useId();
  const err = state?.errors?.email;
  return (
    <form action={action} className="max-w-md" noValidate>
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${id}-err` : undefined}
          placeholder="you@example.com"
          className={`h-12 min-w-0 flex-1 rounded-md border px-3 text-[16px] text-charcoal ${err ? "border-error" : "border-line"} bg-snow`}
        />
        <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button
          disabled={pending}
          className={`h-12 shrink-0 rounded-md px-5 font-semibold ${tone === "dark" ? "bg-snow text-pine hover:bg-canvas" : "bg-ember-deep text-snow hover:bg-[#a9470c]"}`}
        >
          {pending ? "Signing up…" : "Sign up"}
        </button>
      </div>
      <p id={`${id}-err`} role={state && !state.ok ? "alert" : "status"} className="mt-2 min-h-5 text-[14px]">
        {state?.message}
      </p>
    </form>
  );
}
