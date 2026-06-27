import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  return resend.emails.send({
    from: params.from || "Amir Islamic Collections <noreply@yourdomain.com>",
    to: Array.isArray(params.to) ? params.to : [params.to],
    subject: params.subject,
    html: params.html,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to Amir Islamic Collections",
    html: `
      <h1>Welcome to Amir Islamic Collections, ${name}!</h1>
      <p>Thank you for joining our community. We're excited to have you with us.</p>
      <p>Browse our collection of premium Islamic products and enjoy a seamless shopping experience.</p>
      <p>May Allah bless your shopping!</p>
    `,
  });
}

export async function sendOrderConfirmation(email: string, orderId: string) {
  return sendEmail({
    to: email,
    subject: `Order Confirmed - ${orderId}`,
    html: `
      <h1>Order Confirmed!</h1>
      <p>Your order #${orderId} has been confirmed.</p>
      <p>We'll notify you once it ships.</p>
    `,
  });
}
