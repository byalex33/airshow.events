"use client";

// Adapted from beui.dev/components/blocks/signup-form. MIT: public/licenses/beui.txt.
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Check } from "@/components/beui/icons";
import { sendContact } from "./actions";

const fields = [
  { name: "name", label: "Your name", placeholder: "Alex Smith", maxLength: 100, autoComplete: "name" },
  { name: "email", label: "Email address", placeholder: "you@example.com", maxLength: 254, autoComplete: "email" },
  { name: "message", label: "Message", placeholder: "Event name, dates, location and an official link…", maxLength: 5000, autoComplete: "off" },
] as const;

export function ContactForm() {
  const reduce = useReducedMotion();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  function validate(field: HTMLInputElement | HTMLTextAreaElement) {
    field.setCustomValidity("");
    if (!field.value.trim()) field.setCustomValidity("Please fill in this field.");
    if (field.name === "message" && field.value.trim().length < 10) {
      field.setCustomValidity("Please write at least 10 characters.");
    }
    setErrors((current) => ({ ...current, [field.name]: field.validationMessage }));
    return field.validity.valid;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    let firstInvalid: HTMLInputElement | HTMLTextAreaElement | undefined;
    for (const { name } of fields) {
      const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
      if (!validate(field)) firstInvalid ??= field;
    }
    if (firstInvalid) { firstInvalid.focus(); return; }
    setPending(true);
    setResult(null);
    try {
      const response = await sendContact(new FormData(form));
      setResult(response);
      if (response.ok) { form.reset(); setErrors({}); }
    } catch {
      setResult({ ok: false, message: "We couldn't send your message. Please try again in a moment." });
    } finally {
      setPending(false);
    }
  }
  const buttonLabel = pending ? "Sending message" : result?.ok ? "Message sent" : result ? "Try again" : "Send message";
  return (
    <form className="contact-form" noValidate onSubmit={submit} aria-busy={pending}>
      <div className="contact-form-heading">
        <h1>Are we missing an event?</h1>
        <p>Share an airshow, suggest a correction or just say hello.</p>
      </div>
      <div>
        {fields.map(({ name, label, ...attributes }) => {
          const Field = name === "message" ? "textarea" : "input";
          return (
            <div className="contact-field" key={name}>
              <label htmlFor={`contact-${name}`}>{label}</label>
              <div className="contact-input-wrap">
                <Field {...attributes} id={`contact-${name}`} name={name} required
                  type={name === "email" ? "email" : undefined} rows={name === "message" ? 4 : undefined}
                  disabled={pending} aria-invalid={Boolean(errors[name])} aria-describedby={`contact-${name}-error`}
                  onBlur={(event) => validate(event.currentTarget)}
                  onChange={(event) => {
                    if (name in errors) validate(event.currentTarget);
                    setResult(null);
                  }} />
                {errors[name] === "" && <Check className="contact-valid" />}
              </div>
              <div className="contact-field-error" id={`contact-${name}-error`} aria-live="polite">
                <AnimatePresence initial={false}>
                  {errors[name] && <motion.span key={name} initial={{ opacity: 0, y: reduce ? 0 : -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.18 }}>{errors[name]}</motion.span>}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
      <div hidden aria-hidden="true">
        <label htmlFor="contact-website">Leave this blank</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div role="status" aria-live="polite">
        <AnimatePresence initial={false}>
          {result && <motion.p className={`contact-result ${result.ok ? "success" : "error"}`} initial={{ opacity: 0, y: reduce ? 0 : -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{result.message}</motion.p>}
        </AnimatePresence>
      </div>
      <Button type="submit" disabled={pending} className="contact-submit">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={buttonLabel} className="contact-submit-label" initial={{ opacity: 0, y: reduce ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -6 }} transition={{ duration: reduce ? 0 : 0.15 }}>
            {pending && <span className="contact-spinner" aria-hidden="true" />}
            {result?.ok && <Check />}{buttonLabel}
          </motion.span>
        </AnimatePresence>
      </Button>
      <p className="contact-form-footer">We'll only use your details to respond to your message.</p>
    </form>
  );
}
