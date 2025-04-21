
import { serve } from 'std/server';
import { createTransport } from 'nodemailer';

const { GMAIL_USER, GMAIL_PASS } = Deno.env.toObject();

serve(async (req) => {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Campos obrigatórios não preenchidos.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: GMAIL_USER,
      subject,
      text: message,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
