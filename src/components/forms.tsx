"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { type FormState, sendContact, sendEnquiry } from "@/lib/actions";
import { Button, Notice } from "./ui";

/** Form field: label always visible; error text linked with aria-describedby. */
function Field({
  name,
  label,
  type = "text",
  state,
  required,
  autoComplete,
  options,
  rows,
  defaultValue,
  hint,
}: {
  name: string;
  label: string;
  type?: string;
  state: FormState | null;
  required?: boolean;
  autoComplete?: string;
  options?: string[];
  rows?: number;
  defaultValue?: string;
  hint?: string;
}) {
  const id = useId();
  const err = state?.errors?.[name];
  const describedBy = [hint && `${id}-hint`, err && `${id}-err`].filter(Boolean).join(" ") || undefined;
  const cls = `mt-1 w-full rounded-md border bg-snow px-3 text-[16px] ${err ? "border-error" : "border-line"} focus:border-pine`;
  return (
    <div>
      <label htmlFor={id} className="font-semibold">
        {label}
        {required ? "" : <span className="font-normal text-stone"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-[13px] text-stone">
          {hint}
        </p>
      )}
      {options ? (
        <select id={id} name={name} required={required} defaultValue={defaultValue ?? ""} aria-invalid={err ? true : undefined} aria-describedby={describedBy} className={`${cls} h-12`}>
          <option value="">Choose…</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : rows ? (
        <textarea id={id} name={name} rows={rows} required={required} defaultValue={defaultValue} aria-invalid={err ? true : undefined} aria-describedby={describedBy} className={`${cls} py-2`} />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          aria-invalid={err ? true : undefined}
          aria-describedby={describedBy}
          className={`${cls} h-12`}
        />
      )}
      {err && (
        <p id={`${id}-err`} className="mt-1 text-[14px] text-error">
          ⚠ {err}
        </p>
      )}
    </div>
  );
}

function Result({ state }: { state: FormState | null }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state) ref.current?.focus();
  }, [state]);
  if (!state) return null;
  return (
    <div ref={ref} tabIndex={-1} className="focus:outline-none">
      <Notice tone={state.ok ? "info" : "block"} role={state.ok ? "status" : "alert"} title={state.ok ? "Sent" : "There is a problem"}>
        {state.message}
        {state.errors && (
          <ul className="mt-2 list-disc pl-5">
            {Object.values(state.errors).map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
      </Notice>
    </div>
  );
}

const Honeypot = () => <input type="text" name="company_hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />;

/** Glamping project enquiry (ch. 15): property type, location, units, timing, deck status, message. */
export function EnquiryForm({ segment }: { segment: string }) {
  const [state, action, pending] = useActionState(sendEnquiry, null);
  if (state?.ok) return <Result state={state} />;
  return (
    <form action={action} noValidate className="space-y-4">
      <Result state={state} />
      <input type="hidden" name="segment" value={segment} />
      <Honeypot />
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="name" label="Your name" required autoComplete="name" state={state} />
        <Field name="email" label="Email" type="email" required autoComplete="email" state={state} />
        <Field name="phone" label="Phone" type="tel" autoComplete="tel" state={state} />
        <Field name="propertyType" label="Property type" required options={["Resort", "Campground", "RV resort", "Private land", "Event or logistics", "Other"]} state={state} defaultValue={segment} />
        <Field name="location" label="Property location" required hint="City and state, or country" state={state} />
        <Field name="units" label="Number of units" type="number" required state={state} />
        <Field name="timing" label="When do you need them?" options={["Within 3 months", "3–6 months", "6–12 months", "Just researching"]} state={state} />
        <Field name="deck" label="Deck status" options={["Decks built", "Decks planned", "Need a deck builder", "No decks"]} state={state} />
      </div>
      <Field name="message" label="Tell us about the project" rows={5} state={state} />
      <Button disabled={pending} loading={pending}>
        {pending ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}

/** Contact form with topic routing. */
export function ContactForm({ topic, build }: { topic?: string; build?: string }) {
  const [state, action, pending] = useActionState(sendContact, null);
  if (state?.ok) return <Result state={state} />;
  const topics = ["Sizing and choosing a tent", "An order I placed", "Custom build question", "Repairs", "Glamping project", "Showroom visit", "Something else"];
  return (
    <form action={action} noValidate className="space-y-4">
      <Result state={state} />
      <Honeypot />
      {build && <input type="hidden" name="build" value={build} />}
      <Field name="topic" label="What is it about?" options={topics} state={state} defaultValue={topic === "builder" ? "Custom build question" : topic === "visit" ? "Showroom visit" : undefined} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="name" label="Your name" required autoComplete="name" state={state} />
        <Field name="email" label="Email" type="email" required autoComplete="email" state={state} />
      </div>
      <Field name="phone" label="Phone" type="tel" autoComplete="tel" state={state} />
      <Field name="message" label="Message" rows={6} required state={state} defaultValue={build ? "I have a question about this build: " : undefined} />
      {build && <p className="text-[14px] text-stone">Your saved build is attached to this message.</p>}
      <Button disabled={pending} loading={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
