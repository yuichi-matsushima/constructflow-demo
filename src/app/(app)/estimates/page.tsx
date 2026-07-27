import { asc } from "drizzle-orm";
import { EstimatesTable } from "@/components/estimates/estimates-table";
import { getDb } from "@/db/client";
import { toCustomer, toEstimate, toProject } from "@/db/mappers";
import { customers, estimates, projects } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function EstimatesPage() {
  const db = getDb();
  const [estimateRows, projectRows, customerRows] = await Promise.all([
    db.select().from(estimates).orderBy(asc(estimates.estimateCode)),
    db.select().from(projects).orderBy(asc(projects.projectCode)),
    db.select().from(customers).orderBy(asc(customers.customerCode)),
  ]);

  return (
    <EstimatesTable
      estimates={estimateRows.map(toEstimate)}
      projects={projectRows.map(toProject)}
      customers={customerRows.map(toCustomer)}
    />
  );
}
