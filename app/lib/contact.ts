export type ContactFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactValidation =
  | { kind: "honeypot" }
  | { kind: "invalid"; error: string }
  | { kind: "ok"; fields: ContactFields };

/** Pure validation used by the contact route action (easy to unit-test). */
export function validateContactForm(formData: FormData): ContactValidation {
  if (String(formData.get("website") ?? "").trim()) {
    return { kind: "honeypot" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !subject || !message) {
    return { kind: "invalid", error: "All fields are required." };
  }

  return { kind: "ok", fields: { name, email, subject, message } };
}
