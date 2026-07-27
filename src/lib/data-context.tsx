"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  Customer,
  Estimate,
  Project,
  customers as seedCustomers,
  estimates as seedEstimates,
  projects as seedProjects,
} from "@/lib/mock-data";

function nextId(prefix: string, ids: string[]): string {
  const max = ids.reduce((m, id) => {
    const n = Number(id.split("-")[1]);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `${prefix}-${max + 1}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export type NewCustomerInput = Omit<Customer, "id" | "registeredAt">;
export type NewProjectInput = Omit<Project, "id" | "progress" | "phases"> & {
  progress?: number;
};
export type NewEstimateInput = Omit<Estimate, "id" | "createdAt">;

interface DataContextValue {
  customers: Customer[];
  projects: Project[];
  estimates: Estimate[];
  addCustomer: (input: NewCustomerInput) => Customer;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  addProject: (input: NewProjectInput) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  addEstimate: (input: NewEstimateInput) => Estimate;
  updateEstimate: (id: string, patch: Partial<Estimate>) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [estimates, setEstimates] = useState<Estimate[]>(seedEstimates);

  const value = useMemo<DataContextValue>(
    () => ({
      customers,
      projects,
      estimates,
      addCustomer: (input) => {
        const newCustomer: Customer = {
          ...input,
          id: nextId("cu", customers.map((c) => c.id)),
          registeredAt: today(),
        };
        setCustomers((prev) => [...prev, newCustomer]);
        return newCustomer;
      },
      updateCustomer: (id, patch) => {
        setCustomers((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
        );
      },
      addProject: (input) => {
        const newProject: Project = {
          ...input,
          id: nextId("pj", projects.map((p) => p.id)),
          progress: input.progress ?? 0,
          phases: [
            { name: "契約", start: input.contractDate, end: input.contractDate, done: true },
            { name: "設計", start: input.startDate, end: input.startDate, done: false },
            { name: "着工", start: input.startDate, end: input.startDate, done: false },
            { name: "引き渡し", start: input.endDate, end: input.endDate, done: false },
          ],
        };
        setProjects((prev) => [...prev, newProject]);
        return newProject;
      },
      updateProject: (id, patch) => {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
        );
      },
      addEstimate: (input) => {
        const newEstimate: Estimate = {
          ...input,
          id: nextId("es", estimates.map((e) => e.id)),
          createdAt: today(),
        };
        setEstimates((prev) => [...prev, newEstimate]);
        return newEstimate;
      },
      updateEstimate: (id, patch) => {
        setEstimates((prev) =>
          prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
        );
      },
    }),
    [customers, projects, estimates]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within a DataProvider");
  }
  return ctx;
}
