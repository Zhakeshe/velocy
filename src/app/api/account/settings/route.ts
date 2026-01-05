import { NextResponse } from "next/server";

import { updateAccountSettings } from "@/lib/server/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      currentEmail,
      name,
      newEmail,
      currentPassword,
      newPassword,
      notifyEmail,
      notifyBrowser,
      twoFactorEnabled,
    } = body ?? {};

    if (!currentEmail) {
      return NextResponse.json({ error: "Отсутствует текущий email" }, { status: 400 });
    }

    const user = await updateAccountSettings({
      currentEmail,
      name,
      newEmail,
      currentPassword,
      newPassword,
      notifyEmail,
      notifyBrowser,
      twoFactorEnabled,
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Не удалось обновить профиль" }, { status: 400 });
  }
}
