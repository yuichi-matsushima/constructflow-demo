"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { projects } from "@/db/schema";
import { nextCode, nextId, yearOf } from "@/lib/codes";

const projectSchema = z.object({
  name: z.string().min(1),
  customerId: z.string().min(1),
  status: z.enum(["商談中", "契約済み", "設計中", "施工中", "完了"]),
  constructionType: z.enum(["新築", "リフォーム", "増築", "店舗改装"]),
  priority: z.enum(["高", "中", "低"]),
  structureType: z.enum(["木造", "軽量鉄骨", "鉄骨", "RC"]),
  paymentStatus: z.enum(["未請求", "一部入金", "入金済み"]),
  budget: z.number().int().min(0),
  floorAreaSqm: z.number().min(0),
  assigneeId: z.string().min(1),
  contractDate: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  postalCode: z.string().min(1),
  address: z.string().min(1),
  remarks: z.string().optional(),
});

const projectUpdateSchema = projectSchema.extend({
  progress: z.number().int().min(0).max(100),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

function revalidateProjectPaths(id: string) {
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  revalidatePath("/");
  revalidatePath("/schedule");
  revalidatePath("/staff");
}

export async function createProject(input: ProjectInput) {
  const data = projectSchema.parse(input);
  const db = getDb();
  const rows = await db
    .select({ id: projects.id, projectCode: projects.projectCode })
    .from(projects);
  const id = nextId("pj", rows.map((r) => r.id));
  const projectCode = nextCode(
    "P",
    yearOf(data.contractDate),
    rows.map((r) => r.projectCode)
  );
  await db.insert(projects).values({
    ...data,
    remarks: data.remarks ?? null,
    id,
    projectCode,
    progress: 0,
    phases: [
      { name: "契約", start: data.contractDate, end: data.contractDate, done: true },
      { name: "設計", start: data.startDate, end: data.startDate, done: false },
      { name: "着工", start: data.startDate, end: data.startDate, done: false },
      { name: "引き渡し", start: data.endDate, end: data.endDate, done: false },
    ],
  });
  revalidateProjectPaths(id);
  return { id, projectCode };
}

export async function updateProject(id: string, input: ProjectUpdateInput) {
  const data = projectUpdateSchema.parse(input);
  await getDb()
    .update(projects)
    .set({ ...data, remarks: data.remarks ?? null })
    .where(eq(projects.id, id));
  revalidateProjectPaths(id);
}
