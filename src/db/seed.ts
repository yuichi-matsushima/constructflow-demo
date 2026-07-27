import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  customers as seedCustomers,
  estimates as seedEstimates,
  projects as seedProjects,
} from "../lib/mock-data";
import { customers, estimates, projects } from "./schema";

async function main() {
  const db = drizzle(neon(process.env.DATABASE_URL!));

  await db.delete(estimates);
  await db.delete(projects);
  await db.delete(customers);

  await db.insert(customers).values(
    seedCustomers.map((c) => ({ ...c, contactPerson: c.contactPerson ?? null }))
  );
  await db.insert(projects).values(
    seedProjects.map((p) => ({ ...p, remarks: p.remarks ?? null }))
  );
  await db.insert(estimates).values(seedEstimates);

  console.log(
    `seeded: customers=${seedCustomers.length}, projects=${seedProjects.length}, estimates=${seedEstimates.length}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
