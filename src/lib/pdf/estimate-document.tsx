import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { Customer, Estimate, formatCurrency, Project } from "@/lib/mock-data";

let fontRegistered = false;

function registerFont() {
  if (fontRegistered) return;
  Font.register({
    family: "NotoSansJP",
    src: "/fonts/NotoSansJP.ttf",
  });
  fontRegistered = true;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansJP",
    fontSize: 10,
    padding: 40,
    color: "#1c1917",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  codeBlock: {
    fontSize: 9,
    color: "#57534e",
  },
  toBlock: {
    marginBottom: 24,
  },
  customerName: {
    fontSize: 14,
    marginBottom: 2,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "#1c1917",
    paddingBottom: 2,
    width: 220,
  },
  fromBlock: {
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 12,
    marginBottom: 4,
  },
  smallText: {
    fontSize: 9,
    color: "#57534e",
    lineHeight: 1.5,
  },
  amountBox: {
    borderWidth: 1,
    borderColor: "#1c1917",
    padding: 12,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 11,
  },
  amountValue: {
    fontSize: 20,
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: "#1c1917",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d6d3d1",
    paddingVertical: 8,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1c1917",
    paddingVertical: 6,
    backgroundColor: "#f5f5f4",
  },
  colItem: { width: "55%", paddingHorizontal: 6 },
  colQty: { width: "15%", paddingHorizontal: 6, textAlign: "center" },
  colAmount: { width: "30%", paddingHorizontal: 6, textAlign: "right" },
  tableHeaderText: {
    fontSize: 9,
    color: "#57534e",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#a8a29e",
    textAlign: "center",
  },
});

export function EstimatePDFDocument({
  estimate,
  project,
  customer,
}: {
  estimate: Estimate;
  project: Project | undefined;
  customer: Customer | undefined;
}) {
  registerFont();

  const taxRate = 0.1;
  const subtotal = Math.round(estimate.amount / (1 + taxRate));
  const tax = estimate.amount - subtotal;

  return (
    <Document
      title={`${estimate.estimateCode}_${estimate.title}`}
      author="ConstructFlow"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>御 見 積 書</Text>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.codeBlock}>見積番号: {estimate.estimateCode}</Text>
            <Text style={styles.codeBlock}>発行日: {estimate.createdAt}</Text>
            <Text style={styles.codeBlock}>有効期限: {estimate.validUntil}</Text>
          </View>
          <View style={styles.fromBlock}>
            <Text style={styles.companyName}>株式会社 ConstructFlow</Text>
            <Text style={styles.smallText}>〒123-0000 みなみ市中央区1-1-1</Text>
            <Text style={styles.smallText}>TEL 03-0000-0000</Text>
          </View>
        </View>

        <View style={styles.toBlock}>
          <Text style={[styles.customerName, styles.underline]}>
            {customer?.name ?? "-"} 様
          </Text>
        </View>

        <Text style={{ marginBottom: 16 }}>
          下記の通りお見積り申し上げます。
        </Text>

        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>御見積金額(税込)</Text>
          <Text style={styles.amountValue}>{formatCurrency(estimate.amount)}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colItem, styles.tableHeaderText]}>件名</Text>
            <Text style={[styles.colQty, styles.tableHeaderText]}>項目数</Text>
            <Text style={[styles.colAmount, styles.tableHeaderText]}>金額</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colItem}>{estimate.title}</Text>
            <Text style={styles.colQty}>{estimate.itemCount}式</Text>
            <Text style={styles.colAmount}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colItem}>消費税(10%)</Text>
            <Text style={styles.colQty}>-</Text>
            <Text style={styles.colAmount}>{formatCurrency(tax)}</Text>
          </View>
          <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.colItem, { fontSize: 11 }]}>合計</Text>
            <Text style={styles.colQty} />
            <Text style={[styles.colAmount, { fontSize: 11 }]}>
              {formatCurrency(estimate.amount)}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 24 }}>
          <Text style={styles.smallText}>対象案件: {project?.name ?? "-"}</Text>
          {project && (
            <Text style={styles.smallText}>案件コード: {project.projectCode}</Text>
          )}
          {project && (
            <Text style={styles.smallText}>施工場所: {project.address}</Text>
          )}
        </View>

        <Text style={styles.footer}>
          ConstructFlow — 工務店向け業務管理デモ(架空データ・ポートフォリオ用サンプル)
        </Text>
      </Page>
    </Document>
  );
}
