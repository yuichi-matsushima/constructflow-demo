import type { Customer, Estimate, Project } from "@/lib/mock-data";
import type { CustomerRow, EstimateRow, ProjectRow } from "./schema";

export function toCustomer(row: CustomerRow): Customer {
  return { ...row, contactPerson: row.contactPerson ?? undefined };
}

export function toProject(row: ProjectRow): Project {
  return { ...row, remarks: row.remarks ?? undefined };
}

export function toEstimate(row: EstimateRow): Estimate {
  return row;
}
