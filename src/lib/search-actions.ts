"use server";

import { or, ilike, desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { customers, estimates, projects } from "@/db/schema";
import { formatCurrency } from "@/lib/mock-data";

export interface SearchHit {
  id: string;
  href: string;
  title: string;
  subtitle: string;
}

export interface SearchResults {
  customers: SearchHit[];
  projects: SearchHit[];
  estimates: SearchHit[];
}

const EMPTY_RESULTS: SearchResults = { customers: [], projects: [], estimates: [] };

export async function searchAll(rawQuery: string): Promise<SearchResults> {
  const query = rawQuery.trim();
  if (query.length === 0) return EMPTY_RESULTS;

  const pattern = `%${query}%`;
  const db = getDb();

  const [customerRows, projectRows, estimateRows] = await Promise.all([
    db
      .select()
      .from(customers)
      .where(
        or(
          ilike(customers.name, pattern),
          ilike(customers.kana, pattern),
          ilike(customers.customerCode, pattern),
          ilike(customers.email, pattern),
          ilike(customers.address, pattern)
        )
      )
      .orderBy(desc(customers.registeredAt))
      .limit(6),
    db
      .select()
      .from(projects)
      .where(
        or(
          ilike(projects.name, pattern),
          ilike(projects.projectCode, pattern),
          ilike(projects.address, pattern)
        )
      )
      .orderBy(desc(projects.contractDate))
      .limit(6),
    db
      .select()
      .from(estimates)
      .where(
        or(
          ilike(estimates.title, pattern),
          ilike(estimates.estimateCode, pattern)
        )
      )
      .orderBy(desc(estimates.createdAt))
      .limit(6),
  ]);

  return {
    customers: customerRows.map((c) => ({
      id: c.id,
      href: `/customers/${c.id}`,
      title: c.name,
      subtitle: `${c.customerCode} ・ ${c.address}`,
    })),
    projects: projectRows.map((p) => ({
      id: p.id,
      href: `/projects/${p.id}`,
      title: p.name,
      subtitle: `${p.projectCode} ・ ${p.status} ・ ${formatCurrency(p.budget)}`,
    })),
    estimates: estimateRows.map((e) => ({
      id: e.id,
      href: `/projects/${e.projectId}`,
      title: e.title,
      subtitle: `${e.estimateCode} ・ ${formatCurrency(e.amount)}`,
    })),
  };
}
