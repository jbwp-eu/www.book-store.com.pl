import { useEffect, useRef } from "react";
import { Form, useNavigate, useNavigation } from "react-router";
import type { Route } from "./+types";
import { validateContactForm } from "~/lib/contact";
import { pageTitle } from "~/lib/site";

export function meta({}: Route.MetaArgs) {
  return [
    { title: pageTitle("Contact") },
    {
      name: "description",
      content: "Get in touch about store projects, APIs, or freelance work.",
    },
  ];
}

type ActionData = { ok: true } | { ok: false; error: string };

export async function action({
  request,
}: Route.ActionArgs): Promise<ActionData> {
  const formspreeUrl = process.env.FORMSPREE_URL;
  if (!formspreeUrl) {
    return { ok: false, error: "Contact form is not configured." };
  }

  const formData = await request.formData();
  const validation = validateContactForm(formData);

  if (validation.kind === "honeypot") {
    return { ok: true };
  }

  if (validation.kind === "invalid") {
    return { ok: false, error: validation.error };
  }

  formData.delete("website");

  const res = await fetch(formspreeUrl, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    return { ok: false, error: "Failed to send message. Please try again." };
  }

  return { ok: true };
}

const ContactPage = ({ actionData }: Route.ComponentProps) => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (navigation.state !== "idle" || !actionData?.ok) return;

    formRef.current?.reset();

    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation.state, actionData, navigate]);

  return (
    <div className="max-w-3xl mx-auto mt-12 px-6 py-8 bg-gray-900">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Contact Me
      </h2>

      <Form method="post" className="relative space-y-6" ref={formRef}>
        {/* Honeypot — hidden from users, filled by many bots */}
        <div
          className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor="website">
            Website
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Full Name
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="w-full mt-1 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100"
            />
          </label>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300"
          >
            Email
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full mt-1 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100"
            />
          </label>
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-300"
          >
            Subject
            <input
              id="subject"
              name="subject"
              type="text"
              required
              className="w-full mt-1 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100"
            />
          </label>
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-300"
          >
            Message
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full mt-1 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100"
            />
          </label>
        </div>

        {actionData?.ok === true && (
          <p className="text-green-400 text-sm">Message sent. Thanks!</p>
        )}
        {actionData?.ok === false && (
          <p className="text-red-400 text-sm">{actionData.error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 transition bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2 rounded-lg cursor-pointer ml-auto block"
        >
          {isSubmitting ? "Sending…" : "Send message"}
        </button>
      </Form>
    </div>
  );
};

export default ContactPage;
