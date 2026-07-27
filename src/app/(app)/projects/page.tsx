import { asc } from "drizzle-orm";
import { ProjectsTable } from "@/components/projects/projects-table";
import { getDb } from "@/db/client";
import { toCustomer, toProject } from "@/db/mappers";
import { customers, projects } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const db = getDb();
  const [projectRows, customerRows] = await Promise.all([
    db.select().from(projects).orderBy(asc(projects.projectCode)),
    db.select().from(customers).orderBy(asc(customers.customerCode)),
  ]);

  return (
    <ProjectsTable
      projects={projectRows.map(toProject)}
      customers={customerRows.map(toCustomer)}
    />
  );
}
