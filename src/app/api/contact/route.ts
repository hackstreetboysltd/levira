const INQUIRY_TO = "hackstreetboyslimited@gmail.com";
const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const message =
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof (body as { message: unknown }).message === "string"
      ? (body as { message: string }).message.trim()
      : "";

  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return Response.json({ error: "Invalid message" }, { status: 400 });
  }

  const res = await fetch(`https://formsubmit.co/ajax/${INQUIRY_TO}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      message,
      _subject: "Levira website inquiry",
      _template: "box",
      _captcha: "false",
    }),
  });

  if (!res.ok) {
    return Response.json({ error: "Failed to send" }, { status: 502 });
  }

  const data = (await res.json().catch(() => null)) as {
    success?: string | boolean;
  } | null;

  if (
    data &&
    (data.success === false || data.success === "false")
  ) {
    return Response.json({ error: "Failed to send" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
