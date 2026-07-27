import { asc } from "drizzle-orm";
import { CustomersTable } from "@/components/customers/customers-table";
import { getDb } from "@/db/client";
import { toCustomer, toProject } from "@/db/mappers";
import { customers, projects } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const db = getDb();
  const [customerRows, projectRows] = await Promise.all([
    db.select().from(customers).orderBy(asc(customers.customerCode)),
    db.select().from(projects).orderBy(asc(projects.projectCode)),
  ]);

  return (
    <CustomersTable
      customers={customerRows.map(toCustomer)}
      projects={projectRows.map(toProject)}
    />
  );
}
