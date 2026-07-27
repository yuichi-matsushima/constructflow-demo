"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { customers } from "@/db/schema";
import { nextCode, nextId, today, yearOf } from "@/lib/codes";

const customerSchema = z.object({
  name: z.string().min(1),
  kana: z.string().min(1),
  type: z.enum(["個人", "法人"]),
  channel: z.enum(["紹介", "Web広告", "チラシ", "展示場", "その他"]),
  postalCode: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1),
  address: z.string().min(1),
  contactPerson: z.string().optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;

function revalidateCustomerPaths(id: string) {
  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  revalidatePath("/");
}

export async function createCustomer(input: CustomerInput) {
  const data = customerSchema.parse(input);
  const db = getDb();
  const rows = await db
    .select({ id: customers.id, customerCode: customers.customerCode })
    .from(customers);
  const registeredAt = today();
  const id = nextId("cu", rows.map((r) => r.id));
  const customerCode = nextCode(
    "C",
    yearOf(registeredAt),
    rows.map((r) => r.customerCode)
  );
  await db.insert(customers).values({
    ...data,
    contactPerson: data.contactPerson ?? null,
    id,
    customerCode,
    registeredAt,
  });
  revalidateCustomerPaths(id);
  return { id, customerCode };
}

export async function updateCustomer(id: string, input: CustomerInput) {
  const data = customerSchema.parse(input);
  await getDb()
    .update(customers)
    .set({ ...data, contactPerson: data.contactPerson ?? null })
    .where(eq(customers.id, id));
  revalidateCustomerPaths(id);
}
