import { jsPDF } from 'jspdf';
import type { Certificate } from '../types';

export const generateCertificatePDF = (cert: Certificate) => {
  // Create landscape A4 PDF document
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background frame / border
  doc.setDrawColor(249, 87, 0); // Primary Orange #F95700
  doc.setLineWidth(3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setDrawColor(0, 82, 156); // Secondary Blue #00529C
  doc.setLineWidth(1);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(0, 82, 156);
  doc.text('RECIFE DIGITAL', pageWidth / 2, 35, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text('PREFEITURA DO RECIFE  •  CESAR SCHOOL', pageWidth / 2, 42, { align: 'center' });

  // Certificate Heading
  doc.setFontSize(22);
  doc.setTextColor(249, 87, 0);
  doc.text('CERTIFICADO DE CONCLUSÃO', pageWidth / 2, 60, { align: 'center' });

  // Body text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text('Certificamos para os devidos fins que', pageWidth / 2, 75, { align: 'center' });

  // Student Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(0, 82, 156);
  doc.text(cert.studentName.toUpperCase(), pageWidth / 2, 90, { align: 'center' });

  // Course completion text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text(
    `concluiu com êxito o curso de capacitação tecnológica em`,
    pageWidth / 2,
    105,
    { align: 'center' }
  );

  // Course Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(249, 87, 0);
  doc.text(`"${cert.courseTitle}"`, pageWidth / 2, 118, { align: 'center' });

  // Stats Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text(
    `Carga Horária: ${cert.workloadHours} Horas   |   Nota Final: ${cert.grade.toFixed(1)} / 10   |   Data: ${cert.issueDate}`,
    pageWidth / 2,
    132,
    { align: 'center' }
  );

  // Competencies
  if (cert.competencies && cert.competencies.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Competências Adquiridas: ${cert.competencies.join(' • ')}`,
      pageWidth / 2,
      142,
      { align: 'center' }
    );
  }

  // Verification & Signatures section
  doc.setDrawColor(226, 232, 240);
  doc.line(30, 160, pageWidth - 30, 160);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Código de Autenticidade: ${cert.verificationCode}`, 30, 175);
  doc.text(`Validação via Blockchain & CESAR School Registry`, 30, 180);

  // Signatures
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Prefeitura do Recife', pageWidth - 80, 175, { align: 'center' });
  doc.text('CESAR School', pageWidth - 30, 175, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Secretaria de Ciência e Tecnologia', pageWidth - 80, 181, { align: 'center' });
  doc.text('Diretoria Acadêmica', pageWidth - 30, 181, { align: 'center' });

  // Save the PDF file
  const fileName = `Certificado_${cert.courseTitle.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
