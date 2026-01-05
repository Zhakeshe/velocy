"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Locale = "ru" | "en" | "kk";

type TranslationValue = string | string[] | Record<string, string | string[]>;

const translations: Record<Locale, Record<string, TranslationValue>> = {
  ru: {
    "nav.home": "Главная",
    "nav.notifications": "Уведомления",
    "nav.balance": "Финансы",
    "nav.purchase": "Каталог услуг",
    "nav.products": "Продукты",
    "nav.automation": "Автоматизации",
    "nav.extensions": "Модули",
    "nav.supportCreate": "Новое обращение",
    "nav.supportActive": "Активные обращения",
    "nav.settings": "Настройки",
    "nav.invoices": "Счета",
    "nav.referrals": "Рефералы",
    "nav.admin": "Админ",
    "quick.home": "Главная",
    "quick.finance": "Финансы",
    "quick.wiki": "Вики",
    "hero.title": "Домашняя",
    "hero.greeting": "Здравствуйте, {name}",
    "hero.subtitle": "Ваше рабочее пространство и последние продукты",
    "hero.ctaPrimary": "Каталог",
    "hero.ctaAlerts": "Оповещения",
    "stats.balance": "Текущий баланс",
    "stats.balanceDelta": "+120 ₽ за 7 дней",
    "stats.products": "Активные продукты",
    "stats.productsHint": "подписок / интеграций",
    "stats.invoice": "Ближайший счёт",
    "stats.invoiceHint": "Автопродление включено",
    "stats.support": "Поддержка",
    "stats.supportHint": "Ответ в течение 5 минут",
    "services.title": "Ваши продукты",
    "services.subtitle": "Список активных и ожидающих элементов",
    "services.emptyTitle": "У вас пока нет продуктов",
    "services.emptyDescription": "Добавьте первый элемент, чтобы он появился здесь.",
    "services.emptyPrimary": "Открыть каталог",
    "services.emptySecondary": "Обновить данные",
    "services.status.active": "Активен",
    "services.price": "Тариф",
    "services.billing": "Оплата",
    "services.open": "Открыть",
    "services.pay": "Оплатить",
    "purchase.title": "Каталог",
    "purchase.subtitle": "Выберите нужное предложение",
    "purchase.filters": ["Подписки", "Команда", "Поддержка", "Аналитика", "Маркетинг", "Безопасность", "Автоматизация"],
    "purchase.tags": ["Комплект запуск", "Премиум сопровождение", "Ускорение процессов", "Доступ к API"],
    "purchase.call": "Перейти к оформлению",
    "wiki.title": "Вики",
    "wiki.subtitle": "Собранные ответы и инструкции",
    "wiki.tip": "Используйте поиск или выберите категорию слева, чтобы быстрее найти нужный сценарий.",
    "admin.title": "Админ панель",
    "admin.subtitle": "Управляйте продуктами, статикой и обращениями",
    "admin.createTitle": "Создать новый продукт",
    "admin.name": "Название",
    "admin.category": "Категория",
    "admin.owner": "Владелец",
    "admin.create": "Добавить",
    "admin.tableTitle": "Каталог продуктов",
    "admin.empty": "Пока пусто — добавьте первый элемент.",
    "admin.delete": "Удалить",
  },
  en: {
    "nav.home": "Home",
    "nav.notifications": "Notifications",
    "nav.balance": "Finance",
    "nav.purchase": "Catalog",
    "nav.products": "Products",
    "nav.automation": "Automation",
    "nav.extensions": "Modules",
    "nav.supportCreate": "New ticket",
    "nav.supportActive": "Active tickets",
    "nav.settings": "Settings",
    "nav.invoices": "Invoices",
    "nav.referrals": "Referrals",
    "nav.admin": "Admin",
    "quick.home": "Home",
    "quick.finance": "Finance",
    "quick.wiki": "Wiki",
    "hero.title": "Home",
    "hero.greeting": "Hello, {name}",
    "hero.subtitle": "Your workspace and recent products",
    "hero.ctaPrimary": "Catalog",
    "hero.ctaAlerts": "Alerts",
    "stats.balance": "Current balance",
    "stats.balanceDelta": "+120 ₽ in 7 days",
    "stats.products": "Active products",
    "stats.productsHint": "subscriptions / integrations",
    "stats.invoice": "Next invoice",
    "stats.invoiceHint": "Auto renewal enabled",
    "stats.support": "Support",
    "stats.supportHint": "Reply within 5 minutes",
    "services.title": "Your products",
    "services.subtitle": "Active and pending items",
    "services.emptyTitle": "You have no products yet",
    "services.emptyDescription": "Add your first item to see it here.",
    "services.emptyPrimary": "Open catalog",
    "services.emptySecondary": "Refresh",
    "services.status.active": "Active",
    "services.price": "Plan",
    "services.billing": "Billing",
    "services.open": "Open",
    "services.pay": "Pay",
    "purchase.title": "Catalog",
    "purchase.subtitle": "Pick an offer",
    "purchase.filters": ["Subscriptions", "Team", "Support", "Analytics", "Marketing", "Security", "Automation"],
    "purchase.tags": ["Launch kit", "Premium care", "Process boost", "API access"],
    "purchase.call": "Proceed to checkout",
    "wiki.title": "Wiki",
    "wiki.subtitle": "All answers and guides",
    "wiki.tip": "Use search or pick a category on the left to jump to the scenario you need.",
    "admin.title": "Admin panel",
    "admin.subtitle": "Manage products, stats, and tickets",
    "admin.createTitle": "Create a new product",
    "admin.name": "Name",
    "admin.category": "Category",
    "admin.owner": "Owner",
    "admin.create": "Add",
    "admin.tableTitle": "Product catalog",
    "admin.empty": "No items yet — add the first one.",
    "admin.delete": "Remove",
  },
  kk: {
    "nav.home": "Басты бет",
    "nav.notifications": "Хабарламалар",
    "nav.balance": "Қаржы",
    "nav.purchase": "Каталог",
    "nav.products": "Өнімдер",
    "nav.automation": "Автоматтандыру",
    "nav.extensions": "Модульдер",
    "nav.supportCreate": "Жаңа өтініш",
    "nav.supportActive": "Белсенді өтініштер",
    "nav.settings": "Баптаулар",
    "nav.invoices": "Шоттар",
    "nav.referrals": "Рефералдар",
    "nav.admin": "Әкімші",
    "quick.home": "Басты",
    "quick.finance": "Қаржы",
    "quick.wiki": "Вики",
    "hero.title": "Басты",
    "hero.greeting": "Сәлеметсіз бе, {name}",
    "hero.subtitle": "Жұмыс кеңістігі және соңғы өнімдер",
    "hero.ctaPrimary": "Каталог",
    "hero.ctaAlerts": "Хабарламалар",
    "stats.balance": "Ағымдағы баланс",
    "stats.balanceDelta": "+120 ₽ / 7 күн",
    "stats.products": "Белсенді өнімдер",
    "stats.productsHint": "жазылымдар / интеграциялар",
    "stats.invoice": "Келесі шот",
    "stats.invoiceHint": "Авто-төлем қосулы",
    "stats.support": "Қолдау",
    "stats.supportHint": "Жауап 5 минут ішінде",
    "services.title": "Өнімдеріңіз",
    "services.subtitle": "Белсенді және күтіп тұрған элементтер",
    "services.emptyTitle": "Әзірге өнім жоқ",
    "services.emptyDescription": "Бірінші элементті қосып көріңіз.",
    "services.emptyPrimary": "Каталогты ашу",
    "services.emptySecondary": "Жаңарту",
    "services.status.active": "Белсенді",
    "services.price": "Тариф",
    "services.billing": "Төлем",
    "services.open": "Ашу",
    "services.pay": "Төлеу",
    "purchase.title": "Каталог",
    "purchase.subtitle": "Қажетті ұсынысты таңдаңыз",
    "purchase.filters": ["Жазылым", "Топ", "Қолдау", "Аналитика", "Маркетинг", "Қауіпсіздік", "Автоматтандыру"],
    "purchase.tags": ["Іске қосу жинағы", "Премиум қолдау", "Үрдісті жылдамдату", "API қолжетімділігі"],
    "purchase.call": "Төлемге өту",
    "wiki.title": "Вики",
    "wiki.subtitle": "Жауаптар мен нұсқаулықтар",
    "wiki.tip": "Қажетті сценарийді табу үшін іздеуді немесе soldaki санатты таңдаңыз.",
    "admin.title": "Әкімші панелі",
    "admin.subtitle": "Өнімдер, статистика және өтініштерді басқарыңыз",
    "admin.createTitle": "Жаңа өнім қосу",
    "admin.name": "Атауы",
    "admin.category": "Санат",
    "admin.owner": "Иесі",
    "admin.create": "Қосу",
    "admin.tableTitle": "Өнім каталоги",
    "admin.empty": "Әзірге бос — бірінші элементті қосыңыз.",
    "admin.delete": "Жою",
  },
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: string, replacements?: Record<string, string>) => TranslationValue;
} | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("ve_locale") as Locale | null;
    if (stored) setLocaleState(stored);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ve_locale", locale);
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = (next: Locale) => setLocaleState(next);

  const t = (key: string, replacements?: Record<string, string>) => {
    const value = translations[locale]?.[key] ?? translations.ru[key] ?? key;
    if (typeof value === "string" && replacements) {
      return Object.entries(replacements).reduce((acc, [token, val]) => acc.replace(`{${token}}`, val), value);
    }
    return value;
  };

  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
