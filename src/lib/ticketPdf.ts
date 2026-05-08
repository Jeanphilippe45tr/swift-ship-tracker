import jsPDF from 'jspdf';
import type { Ticket } from '@/context/AppContext';

export const generateTicketPdf = (ticket: Ticket, shipmentInfo?: { trackingNumber: string; origin: string; destination: string; clientName: string }) => {
  const doc = new jsPDF();
  const W = 210;

  // Header band
  doc.setFillColor(30, 58, 95);
  doc.rect(0, 0, W, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FastTrackerPro', 14, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Global Logistics & Tracking Solutions', 14, 26);

  // Right-side ticket type badge
  const isPaid = ticket.ticketType === 'paid';
  doc.setFillColor(...(isPaid ? [34, 197, 94] : [249, 115, 22]) as [number, number, number]);
  doc.roundedRect(150, 10, 48, 14, 2, 2, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(isPaid ? 'PAYMENT RECEIPT' : 'PAYMENT DUE', 174, 19, { align: 'center' });

  // Ticket title
  doc.setTextColor(30, 58, 95);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(ticket.title || (isPaid ? 'Transit Fee Receipt' : 'Pending Payment Notice'), 14, 50);

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ticket #: ${ticket.ticketNumber}`, 14, 58);
  doc.text(`Date: ${new Date(ticket.createdAt).toLocaleString()}`, 14, 64);

  // Client / shipment info
  let y = 78;
  doc.setDrawColor(220, 220, 220);
  doc.line(14, y - 4, W - 14, y - 4);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 95);
  doc.text('Issued To:', 14, y);
  doc.text('Issued By:', 110, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text(ticket.issuedTo || shipmentInfo?.clientName || '-', 14, y + 6);
  doc.text(ticket.issuedBy || 'FastTrackerPro Admin', 110, y + 6);

  if (shipmentInfo) {
    y += 18;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 95);
    doc.text('Shipment:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(`${shipmentInfo.trackingNumber} - ${shipmentInfo.origin} -> ${shipmentInfo.destination}`, 14, y + 6);
  }

  // Items table
  y += 20;
  doc.setFillColor(30, 58, 95);
  doc.rect(14, y, W - 28, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Description', 18, y + 6);
  doc.text('Amount', W - 18, y + 6, { align: 'right' });
  y += 12;

  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  let total = 0;
  ticket.items.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(14, y - 5, W - 28, 8, 'F');
    }
    doc.text(item.description, 18, y);
    doc.text(`${ticket.currency} ${item.amount.toFixed(2)}`, W - 18, y, { align: 'right' });
    total += item.amount;
    y += 8;
  });

  // Total
  y += 4;
  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(0.5);
  doc.line(W - 90, y, W - 14, y);
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 95);
  doc.text('TOTAL', W - 90, y);
  doc.setTextColor(isPaid ? 34 : 249, isPaid ? 197 : 115, isPaid ? 94 : 22);
  doc.text(`${ticket.currency} ${(ticket.amount || total).toFixed(2)}`, W - 18, y, { align: 'right' });

  // Notes
  if (ticket.notes) {
    y += 16;
    doc.setTextColor(30, 58, 95);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Notes:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const lines = doc.splitTextToSize(ticket.notes, W - 28);
    doc.text(lines, 14, y + 6);
  }

  // Status stamp
  doc.setFontSize(40);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...(isPaid ? [34, 197, 94, 0.2] : [249, 115, 22, 0.2]) as any);
  doc.text(isPaid ? 'PAID' : 'UNPAID', 105, 200, { align: 'center', angle: -20 });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('FastTrackerPro - support@fasttrackerpro.com - www.fasttrackerpro.com', 105, 285, { align: 'center' });
  doc.text('This is an officially issued ticket. Keep it for your records.', 105, 290, { align: 'center' });

  doc.save(`Ticket-${ticket.ticketNumber}.pdf`);
};