"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import { customers } from "@/db/schema";
import { nextCode, nextId, today, withUniqueRetry, yearOf } from "@/lib/codes";

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
  const registeredAt = today();

  const { id, customerCode } = await withUniqueRetry(async () => {
    const rows = await db
      .select({ id: customers.id, customerCode: customers.customerCode })
      .from(customers);
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
    return { id, customerCode };
  });

  revalidateCustomerPaths(id);
  return { id, customerCode };
}

export async function updateCustomer(id: string, input: CustomerInput) {
  const data = customerSchema.parse(input);
  const result = await getDb()
    .update(customers)
    .set({ ...data, contactPerson: data.contactPerson ?? null })
    .where(eq(customers.id, id))
    .returning({ id: customers.id });
  if (result.length === 0) {
    throw new Error("指定された顧客が見つかりません");
  }
  revalidateCustomerPaths(id);
}
