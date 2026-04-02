import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const organization = String(formData.get("organization") ?? "").trim();
  const budget = String(formData.get("budget") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const honeypot = String(formData.get("company_website") ?? "").trim();

  if (honeypot) {
    return redirect("/contact/?sent=1", 303);
  }

  if (!name || !email || !message) {
    return redirect("/contact/?error=missing", 303);
  }

  const resendApiKey = import.meta.env.RESEND_API_KEY;
  const contactTo = import.meta.env.CONTACT_TO_EMAIL ?? "hello@arraystudio.com";
  const contactFrom = import.meta.env.CONTACT_FROM_EMAIL ?? "Array Studio <onboarding@resend.dev>";

  if (!resendApiKey) {
    return redirect("/contact/?error=config", 303);
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: contactFrom,
      to: [contactTo],
      reply_to: email,
      subject: `New Array Studio inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Organization: ${organization || "Not provided"}`,
        `Budget: ${budget || "Not provided"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    return redirect("/contact/?error=send", 303);
  }

  return redirect("/contact/?sent=1", 303);
};
