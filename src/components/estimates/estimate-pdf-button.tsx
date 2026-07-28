"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EstimatePDFDocument } from "@/lib/pdf/estimate-document";
import { Customer, Estimate, Project } from "@/lib/mock-data";

export function EstimatePdfButton({
  estimate,
  project,
  customer,
}: {
  estimate: Estimate;
  project: Project | undefined;
  customer: Customer | undefined;
}) {
  const [generating, setGenerating] = useState(false);

  const handleClick = async () => {
    setGenerating(true);
    try {
      const blob = await pdf(
        <EstimatePDFDocument estimate={estimate} project={project} customer={customer} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${estimate.estimateCode}_${estimate.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleClick}
      disabled={generating}
      aria-label="見積書PDFをダウンロード"
      title="見積書PDFをダウンロード"
    >
      {generating ? (
        <Loader2 className="animate-spin" />
      ) : (
        <FileDown />
      )}
    </Button>
  );
}
