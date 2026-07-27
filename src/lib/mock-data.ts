export type ProjectStatus =
  | "商談中"
  | "契約済み"
  | "設計中"
  | "施工中"
  | "完了";

export type EstimateStatus = "作成中" | "提出済み" | "承認" | "却下";

export type CustomerType = "個人" | "法人";

export interface Staff {
  id: string;
  name: string;
  role: string;
  avatarInitial: string;
}

export interface Customer {
  id: string;
  name: string;
  kana: string;
  type: CustomerType;
  phone: string;
  email: string;
  address: string;
  registeredAt: string;
}

export interface ProjectPhase {
  name: string;
  start: string;
  end: string;
  done: boolean;
}

export interface Project {
  id: string;
  name: string;
  customerId: string;
  status: ProjectStatus;
  budget: number;
  progress: number;
  assigneeId: string;
  startDate: string;
  endDate: string;
  address: string;
  phases: ProjectPhase[];
}

export interface Estimate {
  id: string;
  projectId: string;
  customerId: string;
  amount: number;
  status: EstimateStatus;
  createdAt: string;
  title: string;
}

export interface ActivityItem {
  id: string;
  type: "estimate" | "project" | "customer";
  message: string;
  at: string;
}

export const staff: Staff[] = [
  { id: "st-1", name: "高橋 直人", role: "営業", avatarInitial: "高" },
  { id: "st-2", name: "佐々木 恵美", role: "設計", avatarInitial: "佐" },
  { id: "st-3", name: "中村 亮太", role: "施工管理", avatarInitial: "中" },
  { id: "st-4", name: "小林 美咲", role: "営業事務", avatarInitial: "小" },
];

export const customers: Customer[] = [
  {
    id: "cu-1",
    name: "山内 拓也",
    kana: "ヤマウチ タクヤ",
    type: "個人",
    phone: "090-1234-5678",
    email: "yamauchi@example.com",
    address: "みなみ市さくら町2-3-1",
    registeredAt: "2026-02-14",
  },
  {
    id: "cu-2",
    name: "株式会社ひまわり不動産",
    kana: "ヒマワリフドウサン",
    type: "法人",
    phone: "03-1111-2222",
    email: "info@himawari-fudousan.example.com",
    address: "みなみ市中央区1-1-1 ひまわりビル5F",
    registeredAt: "2026-01-08",
  },
  {
    id: "cu-3",
    name: "小島 里奈",
    kana: "コジマ リナ",
    type: "個人",
    phone: "080-2222-3333",
    email: "kojima@example.com",
    address: "みなみ市北町4-2-8",
    registeredAt: "2026-03-02",
  },
  {
    id: "cu-4",
    name: "松井 健一",
    kana: "マツイ ケンイチ",
    type: "個人",
    phone: "090-4444-5555",
    email: "matsui@example.com",
    address: "みなみ市東町1-9-2",
    registeredAt: "2026-04-20",
  },
  {
    id: "cu-5",
    name: "有限会社グリーンライフ",
    kana: "グリーンライフ",
    type: "法人",
    phone: "03-3333-4444",
    email: "contact@greenlife.example.com",
    address: "みなみ市西町3-4-6",
    registeredAt: "2026-05-11",
  },
  {
    id: "cu-6",
    name: "田村 由香",
    kana: "タムラ ユカ",
    type: "個人",
    phone: "080-6666-7777",
    email: "tamura@example.com",
    address: "みなみ市桜台6-1-3",
    registeredAt: "2026-06-01",
  },
];

export const projects: Project[] = [
  {
    id: "pj-1",
    name: "山内様邸 新築工事",
    customerId: "cu-1",
    status: "施工中",
    budget: 32000000,
    progress: 62,
    assigneeId: "st-3",
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    address: "みなみ市さくら町2-3-1",
    phases: [
      { name: "契約", start: "2026-03-01", end: "2026-03-10", done: true },
      { name: "設計", start: "2026-03-11", end: "2026-04-20", done: true },
      { name: "着工", start: "2026-04-21", end: "2026-05-10", done: true },
      { name: "上棟", start: "2026-05-11", end: "2026-06-30", done: false },
      { name: "内装仕上げ", start: "2026-07-01", end: "2026-08-31", done: false },
      { name: "引き渡し", start: "2026-09-01", end: "2026-09-30", done: false },
    ],
  },
  {
    id: "pj-2",
    name: "ひまわり不動産 賃貸集合住宅",
    customerId: "cu-2",
    status: "設計中",
    budget: 128000000,
    progress: 25,
    assigneeId: "st-2",
    startDate: "2026-05-01",
    endDate: "2027-03-31",
    address: "みなみ市中央区5-2-3",
    phases: [
      { name: "契約", start: "2026-05-01", end: "2026-05-15", done: true },
      { name: "設計", start: "2026-05-16", end: "2026-08-31", done: false },
      { name: "着工", start: "2026-09-01", end: "2026-09-20", done: false },
      { name: "躯体工事", start: "2026-09-21", end: "2026-12-31", done: false },
      { name: "内装仕上げ", start: "2027-01-01", end: "2027-02-28", done: false },
      { name: "引き渡し", start: "2027-03-01", end: "2027-03-31", done: false },
    ],
  },
  {
    id: "pj-3",
    name: "小島様邸 リフォーム工事",
    customerId: "cu-3",
    status: "契約済み",
    budget: 8500000,
    progress: 8,
    assigneeId: "st-1",
    startDate: "2026-07-15",
    endDate: "2026-10-15",
    address: "みなみ市北町4-2-8",
    phases: [
      { name: "契約", start: "2026-07-15", end: "2026-07-20", done: true },
      { name: "設計", start: "2026-07-21", end: "2026-08-10", done: false },
      { name: "着工", start: "2026-08-11", end: "2026-08-20", done: false },
      { name: "内装仕上げ", start: "2026-08-21", end: "2026-09-30", done: false },
      { name: "引き渡し", start: "2026-10-01", end: "2026-10-15", done: false },
    ],
  },
  {
    id: "pj-4",
    name: "松井様邸 新築工事",
    customerId: "cu-4",
    status: "商談中",
    budget: 28000000,
    progress: 3,
    assigneeId: "st-1",
    startDate: "2026-08-01",
    endDate: "2027-02-28",
    address: "みなみ市東町1-9-2",
    phases: [
      { name: "商談", start: "2026-07-01", end: "2026-08-01", done: false },
      { name: "契約", start: "2026-08-02", end: "2026-08-15", done: false },
      { name: "設計", start: "2026-08-16", end: "2026-10-31", done: false },
      { name: "着工", start: "2026-11-01", end: "2026-11-15", done: false },
      { name: "引き渡し", start: "2027-02-01", end: "2027-02-28", done: false },
    ],
  },
  {
    id: "pj-5",
    name: "グリーンライフ 店舗改装工事",
    customerId: "cu-5",
    status: "完了",
    budget: 15400000,
    progress: 100,
    assigneeId: "st-3",
    startDate: "2025-11-01",
    endDate: "2026-02-28",
    address: "みなみ市西町3-4-6",
    phases: [
      { name: "契約", start: "2025-11-01", end: "2025-11-10", done: true },
      { name: "設計", start: "2025-11-11", end: "2025-12-15", done: true },
      { name: "着工", start: "2025-12-16", end: "2026-01-05", done: true },
      { name: "内装仕上げ", start: "2026-01-06", end: "2026-02-15", done: true },
      { name: "引き渡し", start: "2026-02-16", end: "2026-02-28", done: true },
    ],
  },
  {
    id: "pj-6",
    name: "田村様邸 増築工事",
    customerId: "cu-6",
    status: "施工中",
    budget: 6200000,
    progress: 44,
    assigneeId: "st-4",
    startDate: "2026-06-10",
    endDate: "2026-09-10",
    address: "みなみ市桜台6-1-3",
    phases: [
      { name: "契約", start: "2026-06-10", end: "2026-06-15", done: true },
      { name: "設計", start: "2026-06-16", end: "2026-07-05", done: true },
      { name: "着工", start: "2026-07-06", end: "2026-07-20", done: false },
      { name: "内装仕上げ", start: "2026-07-21", end: "2026-08-25", done: false },
      { name: "引き渡し", start: "2026-08-26", end: "2026-09-10", done: false },
    ],
  },
];

export const estimates: Estimate[] = [
  {
    id: "es-1",
    projectId: "pj-1",
    customerId: "cu-1",
    amount: 32000000,
    status: "承認",
    createdAt: "2026-02-20",
    title: "新築工事一式 御見積書",
  },
  {
    id: "es-2",
    projectId: "pj-2",
    customerId: "cu-2",
    amount: 128000000,
    status: "承認",
    createdAt: "2026-04-25",
    title: "賃貸集合住宅 新築工事 御見積書",
  },
  {
    id: "es-3",
    projectId: "pj-3",
    customerId: "cu-3",
    amount: 8500000,
    status: "承認",
    createdAt: "2026-07-05",
    title: "リフォーム工事一式 御見積書",
  },
  {
    id: "es-4",
    projectId: "pj-4",
    customerId: "cu-4",
    amount: 28500000,
    status: "提出済み",
    createdAt: "2026-07-20",
    title: "新築工事一式 御見積書(第1版)",
  },
  {
    id: "es-5",
    projectId: "pj-4",
    customerId: "cu-4",
    amount: 27200000,
    status: "作成中",
    createdAt: "2026-07-25",
    title: "新築工事一式 御見積書(第2版・値引き反映)",
  },
  {
    id: "es-6",
    projectId: "pj-5",
    customerId: "cu-5",
    amount: 15400000,
    status: "承認",
    createdAt: "2025-11-15",
    title: "店舗改装工事一式 御見積書",
  },
  {
    id: "es-7",
    projectId: "pj-6",
    customerId: "cu-6",
    amount: 6200000,
    status: "承認",
    createdAt: "2026-06-12",
    title: "増築工事一式 御見積書",
  },
  {
    id: "es-8",
    projectId: "pj-3",
    customerId: "cu-3",
    amount: 950000,
    status: "却下",
    createdAt: "2026-07-08",
    title: "外構オプション工事 御見積書",
  },
];

export const monthlyRevenue = [
  { month: "2月", revenue: 15400000 },
  { month: "3月", revenue: 9800000 },
  { month: "4月", revenue: 11200000 },
  { month: "5月", revenue: 18600000 },
  { month: "6月", revenue: 14300000 },
  { month: "7月", revenue: 21500000 },
];

export const activities: ActivityItem[] = [
  { id: "ac-1", type: "estimate", message: "松井様邸の見積(第2版)を作成しました", at: "2026-07-25 16:40" },
  { id: "ac-2", type: "project", message: "田村様邸 増築工事の進捗を44%に更新しました", at: "2026-07-24 10:12" },
  { id: "ac-3", type: "estimate", message: "松井様邸の見積を提出しました", at: "2026-07-20 14:05" },
  { id: "ac-4", type: "project", message: "小島様邸 リフォーム工事が契約済みになりました", at: "2026-07-15 11:30" },
  { id: "ac-5", type: "customer", message: "新規顧客「田村 ユカ」様を登録しました", at: "2026-06-01 09:20" },
];

export function getCustomer(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}

export function getStaff(id: string): Staff | undefined {
  return staff.find((s) => s.id === id);
}

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getEstimatesByProject(projectId: string): Estimate[] {
  return estimates.filter((e) => e.projectId === projectId);
}

export function getProjectsByCustomer(customerId: string): Project[] {
  return projects.filter((p) => p.customerId === customerId);
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export const statusColor: Record<ProjectStatus, string> = {
  商談中: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  契約済み: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  設計中: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  施工中: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
  完了: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
};

export const estimateStatusColor: Record<EstimateStatus, string> = {
  作成中: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  提出済み: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  承認: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
  却下: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200",
};
