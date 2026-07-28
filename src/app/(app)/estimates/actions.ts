"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { estimates, projects } from "@/db/schema";
import { nextCode, nextId, today, withUniqueRetry, yearOf } from "@/lib/codes";

const estimateSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1),
  amount: z.number().int().min(0),
  itemCount: z.number().int().min(0),
  status: z.enum(["作成中", "提出済み", "承認", "却下"]),
  validUntil: z.string().min(1),
  taxIncluded: z.boolean(),
});

export type EstimateInput = z.infer<typeof estimateSchema>;

function revalidateEstimatePaths(projectId: string, customerId: string) {
  revalidatePath("/estimates");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/customers/${customerId}`);
  revalidatePath("/");
}

async function customerIdOfProject(projectId: string): Promise<string> {
  const [project] = await getDb()
    .select({ customerId: projects.customerId })
    .from(projects)
    .where(eq(projects.id, projectId));
  if (!project) throw new Error("指定された案件が見つかりません");
  return project.customerId;
}

export async function createEstimate(input: EstimateInput) {
  const data = estimateSchema.parse(input);
  const db = getDb();
  const customerId = await customerIdOfProject(data.projectId);
  const createdAt = today();

  const { id, estimateCode } = await withUniqueRetry(async () => {
    const rows = await db
      .select({ id: estimates.id, estimateCode: estimates.estimateCode })
      .from(estimates);
    const id = nextId("es", rows.map((r) => r.id));
    const estimateCode = nextCode(
      "Q",
      yearOf(createdAt),
      rows.map((r) => r.estimateCode)
    );
    await db.insert(estimates).values({
      ...data,
      customerId,
      id,
      estimateCode,
      createdAt,
    });
    return { id, estimateCode };
  });

  revalidateEstimatePaths(data.projectId, customerId);
  return { id, estimateCode };
}

export async function updateEstimate(id: string, input: EstimateInput) {
  const data = estimateSchema.parse(input);
  const customerId = await customerIdOfProject(data.projectId);
  const result = await getDb()
    .update(estimates)
    .set({ ...data, customerId })
    .where(eq(estimates.id, id))
    .returning({ id: estimates.id });
  if (result.length === 0) {
    throw new Error("指定された見積もりが見つかりません");
  }
  revalidateEstimatePaths(data.projectId, customerId);
}
