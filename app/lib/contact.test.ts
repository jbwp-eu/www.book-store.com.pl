import { describe, expect, it } from "vitest";
import { validateContactForm } from "~/lib/contact";

function form(entries: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    data.set(key, value);
  }
  return data;
}

describe("validateContactForm", () => {
  it("treats filled honeypot as spam", () => {
    expect(
      validateContactForm(
        form({
          website: "http://spam.test",
          name: "Bot",
          email: "bot@test.com",
          subject: "Hi",
          message: "Spam",
        }),
      ),
    ).toEqual({ kind: "honeypot" });
  });

  it("rejects missing required fields", () => {
    expect(
      validateContactForm(
        form({
          name: "Jarek",
          email: "",
          subject: "Hello",
          message: "Message",
        }),
      ),
    ).toEqual({ kind: "invalid", error: "All fields are required." });
  });

  it("accepts a valid submission", () => {
    expect(
      validateContactForm(
        form({
          name: "Jarek",
          email: "jarek@example.com",
          subject: "Hello",
          message: "Message body",
          website: "",
        }),
      ),
    ).toEqual({
      kind: "ok",
      fields: {
        name: "Jarek",
        email: "jarek@example.com",
        subject: "Hello",
        message: "Message body",
      },
    });
  });
});
