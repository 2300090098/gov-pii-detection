import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportScanPdfReport(scan) {
  if (!scan) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(10, 13, 20); // Dark cybersecurity background
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Title
  doc.setTextColor(6, 182, 212); // Cyan accent
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('GOV-PII SENTINEL | SECURITY AUDIT REPORT', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.setFont('helvetica', 'normal');
  doc.text('Detection & Masking Audit of Government-Issued PII', 14, 28);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 28, { align: 'right' });

  // Scan Metadata Section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Scan Metadata & Risk Classification', 14, 52);

  const riskColor = scan.riskLevel === 'HIGH' ? [225, 29, 72] : (scan.riskLevel === 'MEDIUM' ? [217, 119, 6] : [16, 185, 129]);

  autoTable(doc, {
    startY: 56,
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    body: [
      ['Document / File Name', scan.fileName || 'Pasted Text'],
      ['Scan ID', scan.id || 'N/A'],
      ['Scan Timestamp', scan.timestamp ? new Date(scan.timestamp).toLocaleString() : new Date().toLocaleString()],
      ['Total Potential PII Detections', `${scan.detectionCount || 0} findings`],
      ['Systemic Risk Level', `${scan.riskLevel || 'LOW'} (Score: ${scan.riskScore || 0}/100)`],
      ['Categories Identified', (scan.categoriesDetected || []).join(', ') || 'None'],
    ],
    didParseCell: function(data) {
      if (data.row.index === 4 && data.column.index === 1) {
        data.cell.styles.textColor = riskColor;
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  let currentY = doc.lastAutoTable.finalY + 12;

  // Executive Summary & Disclaimer
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. Executive Assessment Summary', 14, currentY);

  currentY += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(scan.summary || 'Scan completed successfully with no critical government PII exposure.', pageWidth - 28);
  doc.text(summaryLines, 14, currentY);
  currentY += (summaryLines.length * 5) + 6;

  // Compliance Notice
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, currentY, pageWidth - 28, 14, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('CONFIDENTIALITY NOTICE: Sensitive values are cryptographically masked in accordance with Privacy by Design.', 18, currentY + 6);
  doc.text('Detections are marked as "Potential PII" and do not constitute a definitive legal validation of government registries.', 18, currentY + 10);
  currentY += 20;

  // Detected Items Table
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. Detected Potential PII Register (Redacted Values)', 14, currentY);

  const tableRows = (scan.detections || []).map((det, index) => [
    index + 1,
    det.category,
    det.maskedValue,
    `${Math.round((det.confidence || 0.7) * 100)}%`,
    det.source || 'Pattern',
    det.riskLevel || 'MEDIUM'
  ]);

  if (tableRows.length === 0) {
    tableRows.push(['-', 'No PII Detections', '-', '-', '-', 'LOW']);
  }

  autoTable(doc, {
    startY: currentY + 4,
    theme: 'striped',
    head: [['#', 'Category', 'Masked Identifier', 'Confidence', 'Engine Source', 'Risk']],
    body: tableRows,
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 9 }
  });

  currentY = doc.lastAutoTable.finalY + 12;

  // Check page overflow for remediation section
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // Remediation Section
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('4. Recommended Remediation & Safeguard Actions', 14, currentY);

  currentY += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const adviceList = scan.remediationAdvice || [
    'Apply field-level masking before persisting or sharing document.',
    'Restrict document access via Role-Based Access Control (RBAC).',
    'Ensure compliance with data localization and privacy mandates (DPDP Act).'
  ];

  adviceList.forEach((item, idx) => {
    const lines = doc.splitTextToSize(`• ${item}`, pageWidth - 28);
    doc.text(lines, 14, currentY);
    currentY += (lines.length * 4.5);
  });

  // Footer on all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Gov-PII Sentinel Automated Audit | Page ${i} of ${totalPages}`, 14, doc.internal.pageSize.getHeight() - 8);
    doc.text('STRICTLY CONFIDENTIAL', pageWidth - 14, doc.internal.pageSize.getHeight() - 8, { align: 'right' });
  }

  // Download trigger
  const safeName = (scan.fileName || 'scan').replace(/[^a-zA-Z0-9-_]/g, '_');
  doc.save(`Security_Report_${safeName}_${Date.now()}.pdf`);
}
