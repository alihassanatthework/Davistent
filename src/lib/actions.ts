"use server";

/**
 * Server actions for forms (ch. 18 "Forms and email"): they work without
 * client script, post to the client's email platform and to sales@, and are
 * rate limited with a honeypot instead of a visual puzzle.
 *
 * Integration points (set in the host's environment store):
 *   EMAIL_PLATFORM_WEBHOOK  newsletter and waitlist
 *   SALES_WEBHOOK           contact, glamping enquiry and builder questions
 */
export type FormState = { ok: boolean; message: string; errors?: Record<string, string> };

const hits = new Map<string, number[]>();
function limited(key: string, max = 5, windowMs = 60_000) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  return list.length > max;
}

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

async function deliver(hook: string | undefined, payload: Record<string, unknown>) {
  if (!hook) {
    console.info("[forms] no webhook configured; payload accepted", { form: payload.form });
    return true;
  }
  try {
    const res = await fetch(hook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function subscribe(_: FormState | null, data: FormData): Promise<FormState> {
  if (data.get("company")) return { ok: true, message: "Thanks. You’re on the list." };
  const email = String(data.get("email") ?? "").trim();
  if (!emailOk(email)) return { ok: false, message: "Enter a valid email address.", errors: { email: "Enter a valid email address, like name@example.com." } };
  if (limited(`sub:${email}`)) return { ok: false, message: "Too many attempts. Try again in a minute." };
  const ok = await deliver(process.env.EMAIL_PLATFORM_WEBHOOK, { form: "newsletter", email });
  return ok ? { ok: true, message: "Thanks. You’re on the list for monthly deals." } : { ok: false, message: "We couldn’t sign you up just now. Please try again." };
}

const required = (data: FormData, fields: [string, string][]) => {
  const errors: Record<string, string> = {};
  for (const [k, label] of fields) if (!String(data.get(k) ?? "").trim()) errors[k] = `Enter ${label}.`;
  const email = String(data.get("email") ?? "");
  if (email && !emailOk(email)) errors.email = "Enter a valid email address, like name@example.com.";
  return errors;
};

export async function sendContact(_: FormState | null, data: FormData): Promise<FormState> {
  if (data.get("company_hp")) return { ok: true, message: "Thanks. We’ll be in touch." };
  const errors = required(data, [
    ["name", "your name"],
    ["email", "your email"],
    ["message", "a message"],
  ]);
  if (Object.keys(errors).length) return { ok: false, message: "Please fix the highlighted fields.", errors };
  if (limited(`contact:${data.get("email")}`)) return { ok: false, message: "Too many attempts. Try again in a minute." };
  const ok = await deliver(process.env.SALES_WEBHOOK, { form: "contact", ...Object.fromEntries(data) });
  return ok ? { ok: true, message: "Thanks. Your message is with our team in Denver." } : { ok: false, message: "We couldn’t send that. Please call (877) 355-2267." };
}

export async function sendEnquiry(_: FormState | null, data: FormData): Promise<FormState> {
  if (data.get("company_hp")) return { ok: true, message: "Thanks. We’ll be in touch." };
  const errors = required(data, [
    ["name", "your name"],
    ["email", "your email"],
    ["propertyType", "the property type"],
    ["location", "the property location"],
    ["units", "the number of units"],
  ]);
  if (Object.keys(errors).length) return { ok: false, message: "Please fix the highlighted fields.", errors };
  if (limited(`enq:${data.get("email")}`)) return { ok: false, message: "Too many attempts. Try again in a minute." };
  const ok = await deliver(process.env.SALES_WEBHOOK, { form: "glamping-enquiry", ...Object.fromEntries(data) });
  return ok
    ? { ok: true, message: "Thanks. Our glamping team will reply with sizing and lead times." }
    : { ok: false, message: "We couldn’t send that. Please call (877) 355-2267." };
}
