export type ProjectStatus =
  | "商談中"
  | "契約済み"
  | "設計中"
  | "施工中"
  | "完了";

export type EstimateStatus = "作成中" | "提出済み" | "承認" | "却下";

export type CustomerType = "個人" | "法人";

export type ConstructionType = "新築" | "リフォーム" | "増築" | "店舗改装";

export type CustomerChannel = "紹介" | "Web広告" | "チラシ" | "展示場" | "その他";

export type ProjectPriority = "高" | "中" | "低";

export type StructureType = "木造" | "軽量鉄骨" | "鉄骨" | "RC";

export type PaymentStatus = "未請求" | "一部入金" | "入金済み";

export interface Staff {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  avatarInitial: string;
}

export interface Customer {
  id: string;
  customerCode: string;
  name: string;
  kana: string;
  type: CustomerType;
  channel: CustomerChannel;
  postalCode: string;
  phone: string;
  email: string;
  address: string;
  contactPerson?: string;
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
  projectCode: string;
  name: string;
  customerId: string;
  status: ProjectStatus;
  constructionType: ConstructionType;
  priority: ProjectPriority;
  structureType: StructureType;
  paymentStatus: PaymentStatus;
  budget: number;
  progress: number;
  assigneeId: string;
  contractDate: string;
  startDate: string;
  endDate: string;
  postalCode: string;
  address: string;
  floorAreaSqm: number;
  remarks?: string;
  phases: ProjectPhase[];
}

export interface Estimate {
  id: string;
  estimateCode: string;
  projectId: string;
  customerId: string;
  amount: number;
  taxIncluded: boolean;
  itemCount: number;
  status: EstimateStatus;
  createdAt: string;
  validUntil: string;
  title: string;
}

export interface ActivityItem {
  id: string;
  type: "estimate" | "project" | "customer";
  message: string;
  at: string;
}

export type NotificationLevel = "warning" | "info";

export interface AppNotification {
  id: string;
  level: NotificationLevel;
  message: string;
  at: string;
}

export const staff: Staff[] = [
  { id: "st-1", employeeId: "E-0142", name: "高橋 直人", role: "営業", department: "営業部", avatarInitial: "高" },
  { id: "st-2", employeeId: "E-0187", name: "佐々木 恵美", role: "設計", department: "設計部", avatarInitial: "佐" },
  { id: "st-3", employeeId: "E-0093", name: "中村 亮太", role: "施工管理", department: "工事部", avatarInitial: "中" },
  { id: "st-4", employeeId: "E-0231", name: "小林 美咲", role: "営業事務", department: "営業部", avatarInitial: "小" },
  { id: "st-5", employeeId: "E-0058", name: "渡辺 大輔", role: "施工管理", department: "工事部", avatarInitial: "渡" },
  { id: "st-6", employeeId: "E-0204", name: "木村 さやか", role: "設計", department: "設計部", avatarInitial: "木" },
  { id: "st-7", employeeId: "E-0276", name: "松本 拓也", role: "営業", department: "営業部", avatarInitial: "松" },
  { id: "st-8", employeeId: "E-0312", name: "田口 玲奈", role: "施工管理", department: "工事部", avatarInitial: "田" },
];

export const customers: Customer[] = [
  { id: "cu-1", customerCode: "C-2026-004", name: "山内 拓也", kana: "ヤマウチ タクヤ", type: "個人", channel: "紹介", postalCode: "123-0001", phone: "090-1234-5678", email: "yamauchi@example.com", address: "みなみ市さくら町2-3-1", registeredAt: "2026-02-14" },
  { id: "cu-2", customerCode: "C-2026-001", name: "株式会社ひまわり不動産", kana: "ヒマワリフドウサン", type: "法人", channel: "紹介", postalCode: "123-0011", phone: "03-1111-2222", email: "info@himawari-fudousan.example.com", address: "みなみ市中央区1-1-1 ひまわりビル5F", contactPerson: "田中 部長", registeredAt: "2026-01-08" },
  { id: "cu-3", customerCode: "C-2026-006", name: "小島 里奈", kana: "コジマ リナ", type: "個人", channel: "Web広告", postalCode: "123-0021", phone: "080-2222-3333", email: "kojima@example.com", address: "みなみ市北町4-2-8", registeredAt: "2026-03-02" },
  { id: "cu-4", customerCode: "C-2026-009", name: "松井 健一", kana: "マツイ ケンイチ", type: "個人", channel: "チラシ", postalCode: "123-0031", phone: "090-4444-5555", email: "matsui@example.com", address: "みなみ市東町1-9-2", registeredAt: "2026-04-20" },
  { id: "cu-5", customerCode: "C-2026-010", name: "有限会社グリーンライフ", kana: "グリーンライフ", type: "法人", channel: "紹介", postalCode: "123-0041", phone: "03-3333-4444", email: "contact@greenlife.example.com", address: "みなみ市西町3-4-6", contactPerson: "鈴木 店長", registeredAt: "2026-05-11" },
  { id: "cu-6", customerCode: "C-2026-012", name: "田村 由香", kana: "タムラ ユカ", type: "個人", channel: "展示場", postalCode: "123-0051", phone: "080-6666-7777", email: "tamura@example.com", address: "みなみ市桜台6-1-3", registeredAt: "2026-06-01" },
  { id: "cu-7", customerCode: "C-2026-002", name: "石川 誠", kana: "イシカワ マコト", type: "個人", channel: "展示場", postalCode: "123-0061", phone: "090-7777-8888", email: "ishikawa@example.com", address: "みなみ市緑町2-1-9", registeredAt: "2026-01-22" },
  { id: "cu-8", customerCode: "C-2025-001", name: "株式会社サンライズ商事", kana: "サンライズショウジ", type: "法人", channel: "紹介", postalCode: "123-0071", phone: "03-5555-6666", email: "info@sunrise-shoji.example.com", address: "みなみ市中央区3-2-1 サンライズビル3F", contactPerson: "山田 総務課長", registeredAt: "2025-12-10" },
  { id: "cu-9", customerCode: "C-2026-005", name: "近藤 美穂", kana: "コンドウ ミホ", type: "個人", channel: "Web広告", postalCode: "123-0081", phone: "080-8888-9999", email: "kondo@example.com", address: "みなみ市南町5-6-2", registeredAt: "2026-02-28" },
  { id: "cu-10", customerCode: "C-2026-007", name: "有限会社フタバ工業", kana: "フタバコウギョウ", type: "法人", channel: "紹介", postalCode: "123-0091", phone: "03-7777-1111", email: "contact@futaba-kogyo.example.com", address: "みなみ市工業団地1-3-5", contactPerson: "斎藤 工場長", registeredAt: "2026-03-15" },
  { id: "cu-11", customerCode: "C-2026-008", name: "藤田 大地", kana: "フジタ ダイチ", type: "個人", channel: "チラシ", postalCode: "123-0101", phone: "090-2223-3334", email: "fujita@example.com", address: "みなみ市旭町3-3-3", registeredAt: "2026-04-02" },
  { id: "cu-12", customerCode: "C-2026-011", name: "村上 真由美", kana: "ムラカミ マユミ", type: "個人", channel: "その他", postalCode: "123-0111", phone: "080-4445-5556", email: "murakami@example.com", address: "みなみ市泉町7-2-4", registeredAt: "2026-05-18" },
  { id: "cu-13", customerCode: "C-2026-003", name: "株式会社アオバ商事", kana: "アオバショウジ", type: "法人", channel: "紹介", postalCode: "123-0121", phone: "03-9999-2222", email: "info@aoba-shoji.example.com", address: "みなみ市青葉区2-4-8 アオバタワー10F", contactPerson: "橋本 経営企画部", registeredAt: "2026-01-30" },
  { id: "cu-14", customerCode: "C-2026-013", name: "岡田 健太", kana: "オカダ ケンタ", type: "個人", channel: "Web広告", postalCode: "123-0131", phone: "090-5556-6667", email: "okada@example.com", address: "みなみ市清水町1-5-7", registeredAt: "2026-06-20" },
  { id: "cu-15", customerCode: "C-2026-014", name: "森田 千尋", kana: "モリタ チヒロ", type: "個人", channel: "展示場", postalCode: "123-0141", phone: "080-6667-7778", email: "morita@example.com", address: "みなみ市栄町4-8-1", registeredAt: "2026-07-01" },
  { id: "cu-16", customerCode: "C-2026-015", name: "西村 拓海", kana: "ニシムラ タクミ", type: "個人", channel: "Web広告", postalCode: "123-0151", phone: "090-9990-1112", email: "nishimura@example.com", address: "みなみ市若葉町2-2-2", registeredAt: "2026-07-10" },
  { id: "cu-17", customerCode: "C-2026-016", name: "有限会社ヤマト設備", kana: "ヤマトセツビ", type: "法人", channel: "紹介", postalCode: "123-0161", phone: "03-4444-8888", email: "contact@yamato-setsubi.example.com", address: "みなみ市港町1-2-3", contactPerson: "山本 課長", registeredAt: "2026-07-15" },
  { id: "cu-18", customerCode: "C-2026-017", name: "橋本 さくら", kana: "ハシモト サクラ", type: "個人", channel: "展示場", postalCode: "123-0171", phone: "080-1112-2223", email: "hashimoto@example.com", address: "みなみ市桜台8-4-2", registeredAt: "2026-07-20" },
];

export const projects: Project[] = [
  {
    id: "pj-1", projectCode: "P-2026-003", name: "山内様邸 新築工事", customerId: "cu-1", status: "施工中", constructionType: "新築",
    priority: "中", structureType: "木造", paymentStatus: "一部入金",
    budget: 32000000, progress: 62, assigneeId: "st-3",
    contractDate: "2026-03-10", startDate: "2026-03-01", endDate: "2026-09-30",
    postalCode: "123-0001", address: "みなみ市さくら町2-3-1", floorAreaSqm: 128.5,
    remarks: "外構オプションの追加見積を対応中",
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
    id: "pj-2", projectCode: "P-2026-004", name: "ひまわり不動産 賃貸集合住宅", customerId: "cu-2", status: "設計中", constructionType: "新築",
    priority: "高", structureType: "RC", paymentStatus: "未請求",
    budget: 128000000, progress: 25, assigneeId: "st-2",
    contractDate: "2026-05-15", startDate: "2026-05-01", endDate: "2027-03-31",
    postalCode: "123-0011", address: "みなみ市中央区5-2-3", floorAreaSqm: 940.2,
    remarks: "共用部レイアウトの最終調整中",
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
    id: "pj-3", projectCode: "P-2026-007", name: "小島様邸 リフォーム工事", customerId: "cu-3", status: "契約済み", constructionType: "リフォーム",
    priority: "低", structureType: "木造", paymentStatus: "未請求",
    budget: 8500000, progress: 8, assigneeId: "st-1",
    contractDate: "2026-07-20", startDate: "2026-07-15", endDate: "2026-10-15",
    postalCode: "123-0021", address: "みなみ市北町4-2-8", floorAreaSqm: 95.0,
    phases: [
      { name: "契約", start: "2026-07-15", end: "2026-07-20", done: true },
      { name: "設計", start: "2026-07-21", end: "2026-08-10", done: false },
      { name: "着工", start: "2026-08-11", end: "2026-08-20", done: false },
      { name: "内装仕上げ", start: "2026-08-21", end: "2026-09-30", done: false },
      { name: "引き渡し", start: "2026-10-01", end: "2026-10-15", done: false },
    ],
  },
  {
    id: "pj-4", projectCode: "P-2026-011", name: "松井様邸 新築工事", customerId: "cu-4", status: "商談中", constructionType: "新築",
    priority: "中", structureType: "木造", paymentStatus: "未請求",
    budget: 28000000, progress: 3, assigneeId: "st-1",
    contractDate: "2026-08-15", startDate: "2026-08-01", endDate: "2027-02-28",
    postalCode: "123-0031", address: "みなみ市東町1-9-2", floorAreaSqm: 112.0,
    phases: [
      { name: "商談", start: "2026-07-01", end: "2026-08-01", done: false },
      { name: "契約", start: "2026-08-02", end: "2026-08-15", done: false },
      { name: "設計", start: "2026-08-16", end: "2026-10-31", done: false },
      { name: "着工", start: "2026-11-01", end: "2026-11-15", done: false },
      { name: "引き渡し", start: "2027-02-01", end: "2027-02-28", done: false },
    ],
  },
  {
    id: "pj-5", projectCode: "P-2025-003", name: "グリーンライフ 店舗改装工事", customerId: "cu-5", status: "完了", constructionType: "店舗改装",
    priority: "中", structureType: "軽量鉄骨", paymentStatus: "入金済み",
    budget: 15400000, progress: 100, assigneeId: "st-3",
    contractDate: "2025-11-10", startDate: "2025-11-01", endDate: "2026-02-28",
    postalCode: "123-0041", address: "みなみ市西町3-4-6", floorAreaSqm: 210.0,
    phases: [
      { name: "契約", start: "2025-11-01", end: "2025-11-10", done: true },
      { name: "設計", start: "2025-11-11", end: "2025-12-15", done: true },
      { name: "着工", start: "2025-12-16", end: "2026-01-05", done: true },
      { name: "内装仕上げ", start: "2026-01-06", end: "2026-02-15", done: true },
      { name: "引き渡し", start: "2026-02-16", end: "2026-02-28", done: true },
    ],
  },
  {
    id: "pj-6", projectCode: "P-2026-005", name: "田村様邸 増築工事", customerId: "cu-6", status: "施工中", constructionType: "増築",
    priority: "低", structureType: "木造", paymentStatus: "一部入金",
    budget: 6200000, progress: 44, assigneeId: "st-4",
    contractDate: "2026-06-15", startDate: "2026-06-10", endDate: "2026-09-10",
    postalCode: "123-0051", address: "みなみ市桜台6-1-3", floorAreaSqm: 42.0,
    phases: [
      { name: "契約", start: "2026-06-10", end: "2026-06-15", done: true },
      { name: "設計", start: "2026-06-16", end: "2026-07-05", done: true },
      { name: "着工", start: "2026-07-06", end: "2026-07-20", done: false },
      { name: "内装仕上げ", start: "2026-07-21", end: "2026-08-25", done: false },
      { name: "引き渡し", start: "2026-08-26", end: "2026-09-10", done: false },
    ],
  },
  {
    id: "pj-7", projectCode: "P-2026-002", name: "石川様邸 新築工事", customerId: "cu-7", status: "施工中", constructionType: "新築",
    priority: "中", structureType: "木造", paymentStatus: "一部入金",
    budget: 24500000, progress: 55, assigneeId: "st-5",
    contractDate: "2026-02-10", startDate: "2026-02-01", endDate: "2026-08-31",
    postalCode: "123-0061", address: "みなみ市緑町2-1-9", floorAreaSqm: 105.0,
    phases: [
      { name: "契約", start: "2026-02-01", end: "2026-02-10", done: true },
      { name: "設計", start: "2026-02-11", end: "2026-03-20", done: true },
      { name: "着工", start: "2026-03-21", end: "2026-04-05", done: true },
      { name: "上棟", start: "2026-04-06", end: "2026-05-31", done: false },
      { name: "内装仕上げ", start: "2026-06-01", end: "2026-08-10", done: false },
      { name: "引き渡し", start: "2026-08-11", end: "2026-08-31", done: false },
    ],
  },
  {
    id: "pj-8", projectCode: "P-2026-001", name: "サンライズ商事 オフィス改装工事", customerId: "cu-8", status: "設計中", constructionType: "店舗改装",
    priority: "高", structureType: "鉄骨", paymentStatus: "未請求",
    budget: 42000000, progress: 18, assigneeId: "st-6",
    contractDate: "2026-01-20", startDate: "2026-01-10", endDate: "2026-11-30",
    postalCode: "123-0071", address: "みなみ市中央区3-2-1", floorAreaSqm: 680.0,
    phases: [
      { name: "契約", start: "2026-01-10", end: "2026-01-20", done: true },
      { name: "設計", start: "2026-01-21", end: "2026-06-30", done: false },
      { name: "着工", start: "2026-07-01", end: "2026-07-20", done: false },
      { name: "内装仕上げ", start: "2026-07-21", end: "2026-11-10", done: false },
      { name: "引き渡し", start: "2026-11-11", end: "2026-11-30", done: false },
    ],
  },
  {
    id: "pj-9", projectCode: "P-2026-006", name: "近藤様邸 リフォーム工事", customerId: "cu-9", status: "契約済み", constructionType: "リフォーム",
    priority: "低", structureType: "木造", paymentStatus: "未請求",
    budget: 5400000, progress: 5, assigneeId: "st-4",
    contractDate: "2026-07-05", startDate: "2026-07-01", endDate: "2026-09-15",
    postalCode: "123-0081", address: "みなみ市南町5-6-2", floorAreaSqm: 78.0,
    phases: [
      { name: "契約", start: "2026-07-01", end: "2026-07-05", done: true },
      { name: "設計", start: "2026-07-06", end: "2026-07-25", done: false },
      { name: "着工", start: "2026-07-26", end: "2026-08-05", done: false },
      { name: "内装仕上げ", start: "2026-08-06", end: "2026-09-05", done: false },
      { name: "引き渡し", start: "2026-09-06", end: "2026-09-15", done: false },
    ],
  },
  {
    id: "pj-10", projectCode: "P-2025-002", name: "フタバ工業 工場増築工事", customerId: "cu-10", status: "施工中", constructionType: "増築",
    priority: "高", structureType: "鉄骨", paymentStatus: "一部入金",
    budget: 68000000, progress: 71, assigneeId: "st-3",
    contractDate: "2025-10-05", startDate: "2025-10-01", endDate: "2026-08-31",
    postalCode: "123-0091", address: "みなみ市工業団地1-3-5", floorAreaSqm: 1520.0,
    remarks: "内装仕上げ工程に遅延リスクあり",
    phases: [
      { name: "契約", start: "2025-10-01", end: "2025-10-05", done: true },
      { name: "設計", start: "2025-10-06", end: "2025-12-15", done: true },
      { name: "着工", start: "2025-12-16", end: "2026-01-10", done: true },
      { name: "躯体工事", start: "2026-01-11", end: "2026-05-31", done: true },
      { name: "内装仕上げ", start: "2026-06-01", end: "2026-08-10", done: false },
      { name: "引き渡し", start: "2026-08-11", end: "2026-08-31", done: false },
    ],
  },
  {
    id: "pj-11", projectCode: "P-2026-012", name: "藤田様邸 新築工事", customerId: "cu-11", status: "商談中", constructionType: "新築",
    priority: "中", structureType: "木造", paymentStatus: "未請求",
    budget: 26800000, progress: 2, assigneeId: "st-1",
    contractDate: "2026-09-01", startDate: "2026-08-20", endDate: "2027-03-15",
    postalCode: "123-0101", address: "みなみ市旭町3-3-3", floorAreaSqm: 118.0,
    phases: [
      { name: "商談", start: "2026-07-20", end: "2026-09-01", done: false },
      { name: "契約", start: "2026-09-02", end: "2026-09-15", done: false },
      { name: "設計", start: "2026-09-16", end: "2026-12-15", done: false },
      { name: "着工", start: "2026-12-16", end: "2027-01-05", done: false },
      { name: "引き渡し", start: "2027-03-01", end: "2027-03-15", done: false },
    ],
  },
  {
    id: "pj-12", projectCode: "P-2025-001", name: "アオバ商事 テナントビル改装工事", customerId: "cu-13", status: "完了", constructionType: "店舗改装",
    priority: "中", structureType: "RC", paymentStatus: "入金済み",
    budget: 31200000, progress: 100, assigneeId: "st-2",
    contractDate: "2025-09-12", startDate: "2025-09-01", endDate: "2026-01-31",
    postalCode: "123-0121", address: "みなみ市青葉区2-4-8", floorAreaSqm: 450.0,
    phases: [
      { name: "契約", start: "2025-09-01", end: "2025-09-12", done: true },
      { name: "設計", start: "2025-09-13", end: "2025-10-31", done: true },
      { name: "着工", start: "2025-11-01", end: "2025-11-20", done: true },
      { name: "内装仕上げ", start: "2025-11-21", end: "2026-01-15", done: true },
      { name: "引き渡し", start: "2026-01-16", end: "2026-01-31", done: true },
    ],
  },
  {
    id: "pj-13", projectCode: "P-2026-010", name: "西村様邸 新築工事", customerId: "cu-16", status: "商談中", constructionType: "新築",
    priority: "中", structureType: "木造", paymentStatus: "未請求",
    budget: 25500000, progress: 0, assigneeId: "st-7",
    contractDate: "2026-08-05", startDate: "2026-08-20", endDate: "2027-02-20",
    postalCode: "123-0151", address: "みなみ市若葉町2-2-2", floorAreaSqm: 110.0,
    phases: [
      { name: "商談", start: "2026-07-15", end: "2026-08-05", done: false },
      { name: "契約", start: "2026-08-06", end: "2026-08-20", done: false },
      { name: "設計", start: "2026-08-21", end: "2026-11-30", done: false },
      { name: "着工", start: "2026-12-01", end: "2026-12-20", done: false },
      { name: "引き渡し", start: "2027-02-01", end: "2027-02-20", done: false },
    ],
  },
  {
    id: "pj-14", projectCode: "P-2026-008", name: "ヤマト設備 倉庫新設工事", customerId: "cu-17", status: "設計中", constructionType: "新築",
    priority: "高", structureType: "鉄骨", paymentStatus: "一部入金",
    budget: 54000000, progress: 12, assigneeId: "st-8",
    contractDate: "2026-07-25", startDate: "2026-07-20", endDate: "2027-04-30",
    postalCode: "123-0161", address: "みなみ市港町5-1-2", floorAreaSqm: 820.0,
    remarks: "倉庫棟の基礎設計についてお客様と最終確認中",
    phases: [
      { name: "契約", start: "2026-07-20", end: "2026-07-25", done: true },
      { name: "設計", start: "2026-07-26", end: "2026-10-31", done: false },
      { name: "着工", start: "2026-11-01", end: "2026-11-20", done: false },
      { name: "躯体工事", start: "2026-11-21", end: "2027-02-28", done: false },
      { name: "引き渡し", start: "2027-04-01", end: "2027-04-30", done: false },
    ],
  },
  {
    id: "pj-15", projectCode: "P-2026-009", name: "橋本様邸 リフォーム工事", customerId: "cu-18", status: "契約済み", constructionType: "リフォーム",
    priority: "低", structureType: "木造", paymentStatus: "未請求",
    budget: 4800000, progress: 4, assigneeId: "st-4",
    contractDate: "2026-07-26", startDate: "2026-08-01", endDate: "2026-10-01",
    postalCode: "123-0171", address: "みなみ市桜台8-4-2", floorAreaSqm: 88.0,
    phases: [
      { name: "契約", start: "2026-07-26", end: "2026-07-26", done: true },
      { name: "設計", start: "2026-07-27", end: "2026-08-15", done: false },
      { name: "着工", start: "2026-08-16", end: "2026-08-31", done: false },
      { name: "引き渡し", start: "2026-09-15", end: "2026-10-01", done: false },
    ],
  },
];

export const estimates: Estimate[] = [
  { id: "es-1", estimateCode: "Q-2026-003", projectId: "pj-1", customerId: "cu-1", amount: 32000000, taxIncluded: true, itemCount: 42, status: "承認", createdAt: "2026-02-20", validUntil: "2026-03-20", title: "新築工事一式 御見積書" },
  { id: "es-2", estimateCode: "Q-2026-004", projectId: "pj-2", customerId: "cu-2", amount: 128000000, taxIncluded: true, itemCount: 96, status: "承認", createdAt: "2026-04-25", validUntil: "2026-05-25", title: "賃貸集合住宅 新築工事 御見積書" },
  { id: "es-3", estimateCode: "Q-2026-008", projectId: "pj-3", customerId: "cu-3", amount: 8500000, taxIncluded: true, itemCount: 28, status: "承認", createdAt: "2026-07-05", validUntil: "2026-08-05", title: "リフォーム工事一式 御見積書" },
  { id: "es-4", estimateCode: "Q-2026-013", projectId: "pj-4", customerId: "cu-4", amount: 28500000, taxIncluded: true, itemCount: 38, status: "提出済み", createdAt: "2026-07-20", validUntil: "2026-08-20", title: "新築工事一式 御見積書(第1版)" },
  { id: "es-5", estimateCode: "Q-2026-016", projectId: "pj-4", customerId: "cu-4", amount: 27200000, taxIncluded: true, itemCount: 38, status: "作成中", createdAt: "2026-07-25", validUntil: "2026-08-25", title: "新築工事一式 御見積書(第2版・値引き反映)" },
  { id: "es-6", estimateCode: "Q-2025-003", projectId: "pj-5", customerId: "cu-5", amount: 15400000, taxIncluded: true, itemCount: 33, status: "承認", createdAt: "2025-11-15", validUntil: "2025-12-15", title: "店舗改装工事一式 御見積書" },
  { id: "es-7", estimateCode: "Q-2026-006", projectId: "pj-6", customerId: "cu-6", amount: 6200000, taxIncluded: true, itemCount: 19, status: "承認", createdAt: "2026-06-12", validUntil: "2026-07-12", title: "増築工事一式 御見積書" },
  { id: "es-8", estimateCode: "Q-2026-009", projectId: "pj-3", customerId: "cu-3", amount: 950000, taxIncluded: true, itemCount: 6, status: "却下", createdAt: "2026-07-08", validUntil: "2026-08-08", title: "外構オプション工事 御見積書" },
  { id: "es-9", estimateCode: "Q-2026-002", projectId: "pj-7", customerId: "cu-7", amount: 24500000, taxIncluded: true, itemCount: 35, status: "承認", createdAt: "2026-01-15", validUntil: "2026-02-15", title: "新築工事一式 御見積書" },
  { id: "es-10", estimateCode: "Q-2026-001", projectId: "pj-8", customerId: "cu-8", amount: 42000000, taxIncluded: true, itemCount: 58, status: "承認", createdAt: "2026-01-05", validUntil: "2026-02-05", title: "オフィス改装工事一式 御見積書" },
  { id: "es-11", estimateCode: "Q-2026-010", projectId: "pj-8", customerId: "cu-8", amount: 3200000, taxIncluded: true, itemCount: 9, status: "提出済み", createdAt: "2026-07-10", validUntil: "2026-08-10", title: "什器・造作追加工事 御見積書" },
  { id: "es-12", estimateCode: "Q-2026-007", projectId: "pj-9", customerId: "cu-9", amount: 5400000, taxIncluded: true, itemCount: 22, status: "承認", createdAt: "2026-06-25", validUntil: "2026-07-25", title: "リフォーム工事一式 御見積書" },
  { id: "es-13", estimateCode: "Q-2025-002", projectId: "pj-10", customerId: "cu-10", amount: 68000000, taxIncluded: true, itemCount: 74, status: "承認", createdAt: "2025-09-20", validUntil: "2025-10-20", title: "工場増築工事一式 御見積書" },
  { id: "es-14", estimateCode: "Q-2026-012", projectId: "pj-10", customerId: "cu-10", amount: 4100000, taxIncluded: true, itemCount: 14, status: "提出済み", createdAt: "2026-07-18", validUntil: "2026-08-18", title: "電気設備追加工事 御見積書" },
  { id: "es-15", estimateCode: "Q-2026-015", projectId: "pj-11", customerId: "cu-11", amount: 26800000, taxIncluded: true, itemCount: 31, status: "作成中", createdAt: "2026-07-22", validUntil: "2026-08-22", title: "新築工事一式 御見積書(仮)" },
  { id: "es-16", estimateCode: "Q-2025-001", projectId: "pj-12", customerId: "cu-13", amount: 31200000, taxIncluded: true, itemCount: 47, status: "承認", createdAt: "2025-09-05", validUntil: "2025-10-05", title: "テナントビル改装工事一式 御見積書" },
  { id: "es-17", estimateCode: "Q-2026-005", projectId: "pj-2", customerId: "cu-2", amount: 5600000, taxIncluded: true, itemCount: 12, status: "却下", createdAt: "2026-05-30", validUntil: "2026-06-30", title: "外構・植栽オプション工事 御見積書" },
  { id: "es-18", estimateCode: "Q-2026-018", projectId: "pj-6", customerId: "cu-6", amount: 480000, taxIncluded: true, itemCount: 4, status: "提出済み", createdAt: "2026-07-26", validUntil: "2026-08-26", title: "エアコン増設工事 御見積書" },
  { id: "es-19", estimateCode: "Q-2026-016b", projectId: "pj-1", customerId: "cu-1", amount: 1200000, taxIncluded: true, itemCount: 8, status: "作成中", createdAt: "2026-07-24", validUntil: "2026-08-24", title: "太陽光発電オプション 御見積書" },
  { id: "es-20", estimateCode: "Q-2026-011", projectId: "pj-9", customerId: "cu-9", amount: 320000, taxIncluded: true, itemCount: 3, status: "承認", createdAt: "2026-07-10", validUntil: "2026-08-10", title: "浴室乾燥機追加工事 御見積書" },
  { id: "es-21", estimateCode: "Q-2026-019", projectId: "pj-13", customerId: "cu-16", amount: 25500000, taxIncluded: true, itemCount: 30, status: "作成中", createdAt: "2026-07-26", validUntil: "2026-08-26", title: "新築工事一式 御見積書(仮)" },
  { id: "es-22", estimateCode: "Q-2026-014", projectId: "pj-14", customerId: "cu-17", amount: 54000000, taxIncluded: true, itemCount: 62, status: "承認", createdAt: "2026-07-21", validUntil: "2026-08-21", title: "倉庫新設工事一式 御見積書" },
  { id: "es-23", estimateCode: "Q-2026-020", projectId: "pj-15", customerId: "cu-18", amount: 4800000, taxIncluded: true, itemCount: 20, status: "提出済み", createdAt: "2026-07-27", validUntil: "2026-08-27", title: "リフォーム工事一式 御見積書" },
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
  { id: "ac-5", type: "customer", message: "新規顧客「田村 由香」様を登録しました", at: "2026-06-01 09:20" },
  { id: "ac-6", type: "project", message: "橋本様邸 リフォーム工事(P-2026-009)が契約済みになりました", at: "2026-07-26 18:00" },
  { id: "ac-7", type: "estimate", message: "ヤマト設備 倉庫新設工事の見積(Q-2026-014)が承認されました", at: "2026-07-21 11:15" },
  { id: "ac-8", type: "customer", message: "新規顧客「西村 拓海」様を登録しました", at: "2026-07-10 09:40" },
];

export interface ProjectLog {
  id: string;
  projectId: string;
  at: string;
  author: string;
  message: string;
}

export const projectLogs: ProjectLog[] = [
  { id: "lg-1", projectId: "pj-1", at: "2026-07-20 10:30", author: "中村 亮太", message: "上棟工程の資材搬入日を現場と調整。8/3着手予定に変更。" },
  { id: "lg-2", projectId: "pj-1", at: "2026-06-25 14:00", author: "高橋 直人", message: "お客様より外構オプションの追加相談あり。見積作成中。" },
  { id: "lg-3", projectId: "pj-2", at: "2026-07-18 09:15", author: "佐々木 恵美", message: "意匠設計の第2案をお客様に提示。共用部レイアウトは概ね合意。" },
  { id: "lg-4", projectId: "pj-3", at: "2026-07-21 16:45", author: "高橋 直人", message: "外構オプションの見積は今回見送りとのご回答。本体工事のみで進行。" },
  { id: "lg-5", projectId: "pj-6", at: "2026-07-15 11:00", author: "小林 美咲", message: "エアコン増設について現地確認を実施。設置位置を確定。" },
  { id: "lg-6", projectId: "pj-8", at: "2026-07-10 13:20", author: "木村 さやか", message: "什器・造作追加工事についてお客様と打ち合わせ。来週承認見込み。" },
  { id: "lg-7", projectId: "pj-10", at: "2026-07-05 08:50", author: "中村 亮太", message: "電気設備追加工事の現地調査を実施。既存配線との干渉なしを確認。" },
  { id: "lg-8", projectId: "pj-9", at: "2026-06-28 10:00", author: "小林 美咲", message: "浴室乾燥機追加のご要望を受領。追加見積を作成し提出済み。" },
  { id: "lg-9", projectId: "pj-14", at: "2026-07-24 15:30", author: "田口 玲奈", message: "倉庫棟の基礎設計についてお客様と最終確認。来週着工判断予定。" },
  { id: "lg-10", projectId: "pj-13", at: "2026-07-26 10:20", author: "松本 拓也", message: "初回プラン提案を実施。予算内での間取り再検討を依頼された。" },
  { id: "lg-11", projectId: "pj-15", at: "2026-07-27 09:00", author: "小林 美咲", message: "契約書類一式を発送。設計打ち合わせの日程調整中。" },
];

export function getLogsByProject(projectId: string): ProjectLog[] {
  return projectLogs.filter((l) => l.projectId === projectId);
}

export const notifications: AppNotification[] = [
  { id: "no-1", level: "warning", message: "松井様邸の見積(第2版)の有効期限が近づいています(2026-08-25)", at: "2026-07-26 09:00" },
  { id: "no-2", level: "warning", message: "フタバ工業 工場増築工事の内装仕上げ工程が遅延の可能性があります", at: "2026-07-25 17:30" },
  { id: "no-3", level: "info", message: "近藤様邸 リフォーム工事が契約済みステータスに変更されました", at: "2026-07-05 13:10" },
  { id: "no-4", level: "warning", message: "サンライズ商事 什器・造作追加工事の見積が未承認のままです", at: "2026-07-24 08:45" },
  { id: "no-5", level: "info", message: "田村様邸 エアコン増設工事の見積を提出しました", at: "2026-07-26 15:20" },
  { id: "no-6", level: "warning", message: "西村様邸 新築工事(P-2026-010)の見積(Q-2026-019)がまだ作成中です", at: "2026-07-27 08:30" },
  { id: "no-7", level: "info", message: "ヤマト設備 倉庫新設工事の見積(Q-2026-014)が承認されました", at: "2026-07-21 11:15" },
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

export function getEstimatesByCustomer(customerId: string): Estimate[] {
  return estimates.filter((e) => e.customerId === customerId);
}

export function getProjectsByCustomer(customerId: string): Project[] {
  return projects.filter((p) => p.customerId === customerId);
}

export function getProjectsByStaff(staffId: string): Project[] {
  return projects.filter((p) => p.assigneeId === staffId);
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export const statusColor: Record<ProjectStatus, string> = {
  商談中: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
  契約済み: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  設計中: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  施工中: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
  完了: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
};

export const estimateStatusColor: Record<EstimateStatus, string> = {
  作成中: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
  提出済み: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  承認: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
  却下: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200",
};

export const priorityColor: Record<ProjectPriority, string> = {
  高: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200",
  中: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  低: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
};

export const paymentStatusColor: Record<PaymentStatus, string> = {
  未請求: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
  一部入金: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  入金済み: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
};
