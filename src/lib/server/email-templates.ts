type TemplateBase = {
  title: string;
  body: string;
  footer?: string;
};

type CodeTemplate = {
  title: string;
  code: string;
  hint?: string;
};

type AmountTemplate = {
  title: string;
  amount: string;
  currency: string;
  method?: string;
  note?: string;
};

type ServiceTemplate = {
  title: string;
  serviceName: string;
  nextInvoice?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function baseTemplate({ title, body, footer }: TemplateBase) {
  return `
  <!doctype html>
  <html lang="ru">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(title)}</title>
      <style>
        body { margin: 0; background: #0c0f16; color: #e8ecf8; font-family: "Inter", "Segoe UI", Arial, sans-serif; }
        .container { max-width: 560px; margin: 0 auto; padding: 32px 20px 48px; }
        .card { background: #151a24; border-radius: 16px; padding: 28px; border: 1px solid #222a3b; }
        .logo { font-size: 22px; font-weight: 700; letter-spacing: 0.08em; color: #f7f7ff; }
        .logo span { color: #47d7a3; }
        .title { font-size: 20px; margin: 18px 0 8px; }
        .text { color: #b8c1d9; font-size: 14px; line-height: 1.6; }
        .code { font-size: 28px; font-weight: 700; letter-spacing: 0.2em; color: #47d7a3; text-align: center; margin: 20px 0; }
        .pill { display: inline-block; background: #1f2636; border: 1px solid #2b3550; padding: 8px 14px; border-radius: 999px; font-size: 13px; color: #dfe6f5; }
        .divider { height: 1px; background: #232b3e; margin: 22px 0; }
        .footer { color: #7c879f; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">VE<span>LOCY</span></div>
        <div class="card">
          ${body}
        </div>
        <div class="footer">${footer ?? "Это письмо отправлено автоматически. Если вы не запрашивали его, просто проигнорируйте."}</div>
      </div>
    </body>
  </html>
  `;
}

export function buildCodeEmail({ title, code, hint }: CodeTemplate) {
  const body = `
    <div class="title">${escapeHtml(title)}</div>
    <p class="text">Используйте код ниже. Он действует ограниченное время.</p>
    <div class="code">${escapeHtml(code)}</div>
    ${hint ? `<p class="text">${escapeHtml(hint)}</p>` : ""}
  `;

  return baseTemplate({ title, body });
}

export function buildTopupReceiptEmail({ title, amount, currency, method, note }: AmountTemplate) {
  const body = `
    <div class="title">${escapeHtml(title)}</div>
    <p class="text">Пополнение успешно зафиксировано. Сохраняйте чек для ваших записей.</p>
    <div class="divider"></div>
    <p class="text"><span class="pill">Сумма: ${escapeHtml(amount)} ${escapeHtml(currency)}</span></p>
    ${method ? `<p class="text">Способ оплаты: <strong>${escapeHtml(method)}</strong></p>` : ""}
    ${note ? `<p class="text">${escapeHtml(note)}</p>` : ""}
  `;

  return baseTemplate({ title, body });
}

export function buildInvoiceEmail({ title, amount, currency, note }: AmountTemplate) {
  const body = `
    <div class="title">${escapeHtml(title)}</div>
    <p class="text">Мы подготовили счет. Перейдите по ссылке в личном кабинете для оплаты.</p>
    <div class="divider"></div>
    <p class="text"><span class="pill">Сумма: ${escapeHtml(amount)} ${escapeHtml(currency)}</span></p>
    ${note ? `<p class="text">${escapeHtml(note)}</p>` : ""}
  `;

  return baseTemplate({ title, body });
}

export function buildVpsActivatedEmail({ title, serviceName, nextInvoice }: ServiceTemplate) {
  const body = `
    <div class="title">${escapeHtml(title)}</div>
    <p class="text">Ваш VPS активирован и готов к работе.</p>
    <div class="divider"></div>
    <p class="text">Услуга: <strong>${escapeHtml(serviceName)}</strong></p>
    ${nextInvoice ? `<p class="text">Следующий платеж: ${escapeHtml(nextInvoice)}</p>` : ""}
  `;

  return baseTemplate({ title, body });
}

export function buildServiceExpiryEmail({ title, serviceName, nextInvoice }: ServiceTemplate) {
  const body = `
    <div class="title">${escapeHtml(title)}</div>
    <p class="text">Срок действия услуги скоро закончится. Пожалуйста, продлите ее заранее.</p>
    <div class="divider"></div>
    <p class="text">Услуга: <strong>${escapeHtml(serviceName)}</strong></p>
    ${nextInvoice ? `<p class="text">Дата окончания: ${escapeHtml(nextInvoice)}</p>` : ""}
  `;

  return baseTemplate({ title, body });
}

export function buildNewsEmail({ title, bodyText }: { title: string; bodyText: string }) {
  const body = `
    <div class="title">${escapeHtml(title)}</div>
    <p class="text">${escapeHtml(bodyText)}</p>
  `;

  return baseTemplate({ title, body });
}
