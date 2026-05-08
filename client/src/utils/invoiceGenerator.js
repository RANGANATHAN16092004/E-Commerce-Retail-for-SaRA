import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(0, 0, 0);
  doc.text("VSR LUXURY", 105, 25, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("INVOICE & ORDER MANIFEST", 105, 33, { align: 'center' });

  // Order Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Order ID: #${order._id.toUpperCase()}`, 15, 55);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 15, 62);
  doc.text(`Payment: ${order.paymentMethod} (${order.isPaid ? 'PAID' : 'PENDING'})`, 15, 67);

  // Billing Details
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO:", 140, 55);
  doc.setFont("helvetica", "normal");
  doc.text(order.user?.name || 'Customer', 140, 62);
  doc.text(order.shippingAddress.address, 140, 67);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 140, 72);
  doc.text(order.shippingAddress.phone, 140, 77);

  // Items Table
  const tableRows = order.orderItems.map(item => [
    item.title,
    `x${item.qty}`,
    `INR ${item.price.toLocaleString()}`,
    `INR ${(item.qty * item.price).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 90,
    head: [['ACQUISITION', 'QTY', 'UNIT PRICE', 'SUBTOTAL']],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      3: { halign: 'right', fontStyle: 'bold' }
    }
  });

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.text("Subtotal:", 140, finalY);
  doc.text(`INR ${order.totalPrice.toLocaleString()}`, 195, finalY, { align: 'right' });
  
  doc.text("Shipping:", 140, finalY + 5);
  doc.text("COMPLIMENTARY", 195, finalY + 5, { align: 'right' });

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", 140, finalY + 15);
  doc.text(`INR ${order.totalPrice.toLocaleString()}`, 195, finalY + 15, { align: 'right' });

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for choosing VSR Luxury Artistry.", 105, 280, { align: 'center' });
  doc.text("This is a computer-generated document and requires no signature.", 105, 285, { align: 'center' });

  // Save
  doc.save(`VSR_Invoice_${order._id.slice(-6).toUpperCase()}.pdf`);
};
