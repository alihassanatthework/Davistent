"use client";

import { useActionState, useId } from "react";
import { subscribe } from "@/lib/actions";
import { buttonClass } from "./ui";

export function SignupForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [state, action, pending] = useActionState(subscribe, null);
  const id = useId();
  const err = state?.errors?.email;
  return (
    <form action={action} className="max-w-md" noValidate>
      <label htmlFor={`${id}-email`} className="mb-1 block text-[13px] font-bold">
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
          className={`h-12 min-w-0 flex-1 rounded-md border px-3 text-[16px] text-charcoal ${err ? "border-error" : "border-slate"} bg-snow`}
        />
        <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button
          disabled={pending}
          className={`shrink-0 ${buttonClass(tone === "dark" ? "inverse" : "primary")}`}
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
