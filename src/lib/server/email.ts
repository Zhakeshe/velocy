import net from "net";
import tls from "tls";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;
const SMTP_SECURE = process.env.SMTP_SECURE === "true";

type SmtpSocket = net.Socket | tls.TLSSocket;

function createSocket() {
  if (!SMTP_HOST) {
    throw new Error("SMTP_HOST is not configured");
  }

  if (SMTP_SECURE) {
    return tls.connect({ host: SMTP_HOST, port: SMTP_PORT });
  }

  return net.connect({ host: SMTP_HOST, port: SMTP_PORT });
}

function formatMessage(payload: EmailPayload) {
  const subject = payload.subject.replace(/[\r\n]+/g, " ");
  return [
    `From: ${SMTP_FROM}`,
    `To: ${payload.to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "",
    payload.html,
    "",
  ].join("\r\n");
}

async function waitForCode(socket: SmtpSocket, expectedCode: number): Promise<string> {
  return await new Promise((resolve, reject) => {
    let buffer = "";

    const onData = (data: Buffer) => {
      buffer += data.toString("utf8");
      const lines = buffer.split("\r\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line) continue;
        const code = Number(line.slice(0, 3));
        const isFinal = line[3] === " ";
        if (!Number.isNaN(code) && isFinal) {
          if (code === expectedCode || Math.floor(code / 100) === Math.floor(expectedCode / 100)) {
            cleanup();
            resolve(line);
            return;
          }
          cleanup();
          reject(new Error(`SMTP error: ${line}`));
          return;
        }
      }
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const onClose = () => {
      cleanup();
      reject(new Error("SMTP connection closed"));
    };

    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("close", onClose);
    };

    socket.on("data", onData);
    socket.on("error", onError);
    socket.on("close", onClose);
  });
}

async function sendCommand(socket: SmtpSocket, command: string, expectedCode: number) {
  socket.write(`${command}\r\n`);
  await waitForCode(socket, expectedCode);
}

export async function sendEmail(payload: EmailPayload) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error("SMTP configuration is incomplete");
  }

  const socket = createSocket();
  socket.setTimeout(15_000);

  try {
    await waitForCode(socket, 220);
    await sendCommand(socket, `EHLO ${SMTP_HOST}`, 250);
    await sendCommand(socket, "AUTH LOGIN", 334);
    await sendCommand(socket, Buffer.from(SMTP_USER).toString("base64"), 334);
    await sendCommand(socket, Buffer.from(SMTP_PASS).toString("base64"), 235);
    await sendCommand(socket, `MAIL FROM:<${SMTP_FROM}>`, 250);
    await sendCommand(socket, `RCPT TO:<${payload.to}>`, 250);
    await sendCommand(socket, "DATA", 354);
    socket.write(`${formatMessage(payload)}\r\n.\r\n`);
    await waitForCode(socket, 250);
    await sendCommand(socket, "QUIT", 221);
  } finally {
    socket.end();
  }
}
