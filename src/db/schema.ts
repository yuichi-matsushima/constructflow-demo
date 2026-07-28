import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import type {
  ConstructionType,
  CustomerChannel,
  CustomerType,
  EstimateStatus,
  PaymentStatus,
  ProjectPhase,
  ProjectPriority,
  ProjectStatus,
  StructureType,
} from "@/lib/mock-data";

export const customers = pgTable("customers", {
  id: text("id").primaryKey(),
  customerCode: text("customer_code").notNull().unique(),
  name: text("name").notNull(),
  kana: text("kana").notNull(),
  type: text("type").$type<CustomerType>().notNull(),
  channel: text("channel").$type<CustomerChannel>().notNull(),
  postalCode: text("postal_code").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  contactPerson: text("contact_person"),
  registeredAt: text("registered_at").notNull(),
});

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  projectCode: text("project_code").notNull().unique(),
  name: text("name").notNull(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  status: text("status").$type<ProjectStatus>().notNull(),
  constructionType: text("construction_type").$type<ConstructionType>().notNull(),
  priority: text("priority").$type<ProjectPriority>().notNull(),
  structureType: text("structure_type").$type<StructureType>().notNull(),
  paymentStatus: text("payment_status").$type<PaymentStatus>().notNull(),
  budget: integer("budget").notNull(),
  progress: integer("progress").notNull().default(0),
  assigneeId: text("assignee_id").notNull(),
  contractDate: text("contract_date").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  postalCode: text("postal_code").notNull(),
  address: text("address").notNull(),
  floorAreaSqm: doublePrecision("floor_area_sqm").notNull(),
  remarks: text("remarks"),
  phases: jsonb("phases").$type<ProjectPhase[]>().notNull().default([]),
});

export const estimates = pgTable("estimates", {
  id: text("id").primaryKey(),
  estimateCode: text("estimate_code").notNull().unique(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  amount: integer("amount").notNull(),
  taxIncluded: boolean("tax_included").notNull().default(true),
  itemCount: integer("item_count").notNull(),
  status: text("status").$type<EstimateStatus>().notNull(),
  createdAt: text("created_at").notNull(),
  validUntil: text("valid_until").notNull(),
  title: text("title").notNull(),
  sentAt: text("sent_at"),
  sentTo: text("sent_to"),
});

export type CustomerRow = typeof customers.$inferSelect;
export type ProjectRow = typeof projects.$inferSelect;
export type EstimateRow = typeof estimates.$inferSelect;
