import { NextResponse } from "next/server";

import { runProvisioningCycle } from "@/lib/server/provisioning/worker";

export async function POST(request: Request) {
  const secret = process.env.PROVISIONING_RUN_TOKEN;
  if (secret && request.headers.get("x-provisioning-token") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? "1");
  const runs = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 5) : 1;

  const jobs = [];
  for (let i = 0; i < runs; i += 1) {
    const job = await runProvisioningCycle();
    if (!job) break;
    jobs.push(job.id);
  }

  return NextResponse.json({ processed: jobs.length, jobs });
}
