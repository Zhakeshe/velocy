import { claimProvisioningJob, completeProvisioningJob, failProvisioningJob } from "@/lib/server/database";
import { provisionOrder } from "./service";

export async function runProvisioningCycle() {
  const job = await claimProvisioningJob();
  if (!job) return null;

  try {
    await provisionOrder(job.orderId);
    await completeProvisioningJob(job.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Provisioning error";
    await failProvisioningJob({ jobId: job.id, error: message, retryDelaySeconds: 120 });
  }

  return job;
}
