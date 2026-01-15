import { useState } from 'react';
import { Platform, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { documentDirectory, copyAsync, getInfoAsync, makeDirectoryAsync } from 'expo-file-system/legacy';
import { Order } from '../types';
import { generateInvoiceNumber, formatInvoiceDate } from '../utils/invoicePDF';

// Type workaround for FileSystem
const fs = { documentDirectory: documentDirectory, copyAsync } as any;

/**
 * Hook for managing invoice generation and actions
 * Handles HTML generation, PDF creation, and platform-specific sharing
 */
export const useInvoiceActions = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Generate complete invoice HTML from order data
   */
  const generateInvoiceHTML = (order: Order, logoUri?: string): string => {
    const invoiceNumber = generateInvoiceNumber(order.id);
    const formattedDate = formatInvoiceDate(order.orderDate);
    const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const subtotal = order.totalAmount || 0;
    const discount = order.discount || 0;
    const finalAmount = order.finalAmount || subtotal - discount;

    const itemsHTML = (order.items || [])
      .map(
        (item) => `
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 10px 8px; text-align: left; font-size: 11px; color: #000;">
          ${item.product.name}
        </td>
        <td style="padding: 10px 8px; text-align: center; font-size: 11px; color: #000;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 8px; text-align: center; font-size: 11px; color: #000;">
          ₹${item.price.toFixed(2)}
        </td>
        <td style="padding: 10px 8px; text-align: right; font-size: 11px; color: #006400; font-weight: bold;">
          ₹${(item.quantity * item.price).toFixed(2)}
        </td>
      </tr>
    `
      )
      .join('');

    const paymentMethodLabel =
      order.customerDetails?.paymentMethod === 'cash'
        ? 'Cash on Delivery'
        : order.customerDetails?.paymentMethod === 'card'
        ? 'Card Payment'
        : 'UPI Payment';

    const statusColor =
      order.status === 'completed'
        ? '#4caf50'
        : order.status === 'pending'
        ? '#ff9800'
        : '#f44336';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceNumber}</title>
  <style>
    * {
      margin: 10;
      padding: 20;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      color: #000;
      background: #fff;
      padding: 0;
      margin: 0;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 40px 30px;
      min-height: 100vh;
    }
    
    /* HEADER */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #006400;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 16px;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }
    
    .company-info h1 {
      font-size: 18px;
      font-weight: bold;
      color: #006400;
      margin-bottom: 4px;
    }
    
    .company-info p {
      font-size: 11px;
      color: #888;
      margin-bottom: 2px;
      line-height: 14px;
    }
    
    .invoice-meta {
      text-align: right;
    }
    
    .invoice-title {
      font-size: 28px;
      font-weight: bold;
      color: #006400;
      margin-bottom: 12px;
    }
    
    .meta-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      font-size: 11px;
      margin-bottom: 8px;
    }
    
    .meta-label {
      color: #888;
      font-weight: 600;
    }
    
    .meta-value {
      color: #006400;
      font-weight: bold;
    }
    
    /* CONTENT */
    .content {
      margin: 24px 0;
    }
    
    .bill-to {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 24px;
    }
    
    .bill-column {
      flex: 1;
    }
    
    .section-label {
      font-size: 12px;
      font-weight: bold;
      color: #006400;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .customer-name {
      font-size: 14px;
      font-weight: bold;
      color: #000;
      margin-bottom: 4px;
    }
    
    .customer-detail {
      font-size: 11px;
      color: #888;
      margin-bottom: 3px;
      line-height: 15px;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 11px;
    }
    
    .detail-label {
      color: #888;
      font-weight: 600;
    }
    
    .detail-value {
      color: #000;
      font-weight: bold;
    }
    
    /* TABLE */
    .items-section {
      margin-bottom: 20px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e0e0e0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    thead {
      background-color: #006400;
      color: white;
    }
    
    th {
      padding: 10px 8px;
      font-weight: bold;
      font-size: 11px;
      text-align: center;
    }
    
    th.item-col {
      text-align: left;
      flex: 2;
    }
    
    th.qty-col {
      flex: 0.8;
    }
    
    th.price-col {
      flex: 1;
    }
    
    th.total-col {
      text-align: right;
      padding-right: 8px;
      flex: 1.2;
    }
    
    td {
      padding: 10px 8px;
      font-size: 11px;
      color: #000;
      text-align: center;
    }
    
    td.item-col {
      text-align: left;
      flex: 2;
    }
    
    td.qty-col {
      flex: 0.8;
    }
    
    td.price-col {
      flex: 1;
    }
    
    td.total-col {
      text-align: right;
      padding-right: 8px;
      flex: 1.2;
      font-weight: bold;
      color: #006400;
    }
    
    /* PRICE BREAKDOWN */
    .price-breakdown {
      background-color: #f9f9f9;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    
    .breakdown-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 0.5px solid #e0e0e0;
      font-size: 12px;
    }
    
    .breakdown-row.final {
      background-color: #006400;
      color: white;
      padding: 10px 8px;
      margin: -12px -12px 0 -12px;
      border: none;
      border-radius: 0 0 8px 8px;
    }
    
    .breakdown-label {
      color: #000;
      font-weight: 500;
    }
    
    .breakdown-row.final .breakdown-label {
      color: white;
      font-weight: bold;
      font-size: 13px;
    }
    
    .breakdown-value {
      color: #000;
      font-weight: 600;
    }
    
    .breakdown-row.final .breakdown-value {
      color: white;
      font-weight: bold;
      font-size: 14px;
    }
    
    .discount-text {
      color: #006400;
    }
    
    /* NOTES */
    .notes-section {
      background-color: #f0f7ff;
      padding: 12px;
      border-radius: 8px;
      border-left: 3px solid #006400;
    }
    
    .notes-label {
      font-size: 11px;
      font-weight: bold;
      color: #006400;
      margin-bottom: 6px;
    }
    
    .notes-text {
      font-size: 10px;
      color: #888;
      line-height: 14px;
    }
    
    /* FOOTER */
    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 2px solid #006400;
    }
    
    .footer-content {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      background-color: #f5f5f5;
      padding: 12px;
      border-radius: 8px;
    }
    
    .footer-section {
      flex: 1;
      margin: 0 6px;
    }
    
    .footer-title {
      font-size: 12px;
      font-weight: bold;
      color: #006400;
      margin-bottom: 4px;
    }
    
    .footer-text {
      font-size: 10px;
      color: #888;
      line-height: 14px;
    }
    
    .footer-bottom {
      text-align: center;
      padding-top: 12px;
      border-top: 1px solid #ddd;
    }
    
    .footer-bottom-text {
      font-size: 10px;
      color: #888;
      margin-bottom: 4px;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .container {
        padding: 40px 30px;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- HEADER -->
    <div class="header">
      <div class="header-content">
        ${
          logoUri
            ? `<img src="${logoUri}" alt="Logo" class="logo" />`
            : ''
        }
        <div class="company-info">
          <h1>Suryadev Seeds</h1>
          <p>Premium Quality Seeds & Agricultural Products</p>
          <p>Email: info@suryadeveseeds.com | Phone: +91-XXXXXXXXXX</p>
          <p>Address: Suryadev Seeds, City, State - PIN</p>
        </div>
      </div>
      <div class="invoice-meta">
        <div class="invoice-title">INVOICE</div>
        <div class="meta-row">
          <span class="meta-label">Invoice #</span>
          <span class="meta-value">${invoiceNumber}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Date</span>
          <span class="meta-value">${formattedDate}</span>
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="content">
      <div class="bill-to">
        <div class="bill-column">
          <div class="section-label">Bill To</div>
          <div class="customer-name">${order.customerDetails?.name || 'N/A'}</div>
          <div class="customer-detail">📞 ${order.customerDetails?.mobileNo || 'N/A'}</div>
          <div class="customer-detail">📍 ${order.customerDetails?.address || 'N/A'}</div>
        </div>
        <div class="bill-column">
          <div class="section-label">Order Details</div>
          <div class="detail-row">
            <span class="detail-label">Order Date:</span>
            <span class="detail-value">${new Date(order.orderDate).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value" style="color: ${statusColor};">
              ${order.status?.toUpperCase()}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment:</span>
            <span class="detail-value">${paymentMethodLabel}</span>
          </div>
        </div>
      </div>

      <!-- ITEMS TABLE -->
      <div class="items-section">
        <table>
          <thead>
            <tr>
              <th class="item-col">Item</th>
              <th class="qty-col">Qty</th>
              <th class="price-col">Price</th>
              <th class="total-col">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML || '<tr><td colspan="4" style="text-align: center; padding: 20px;">No items found</td></tr>'}
          </tbody>
        </table>
      </div>

      <!-- PRICE BREAKDOWN -->
      <div class="price-breakdown">
        <div class="breakdown-row">
          <span class="breakdown-label">Subtotal (${itemCount} items)</span>
          <span class="breakdown-value">₹${subtotal.toFixed(2)}</span>
        </div>
        ${
          discount > 0
            ? `
        <div class="breakdown-row">
          <span class="breakdown-label discount-text">Discount (−)</span>
          <span class="breakdown-value discount-text">−₹${discount.toFixed(2)}</span>
        </div>
        `
            : ''
        }
        <div class="breakdown-row final">
          <span class="breakdown-label">FINAL AMOUNT</span>
          <span class="breakdown-value">₹${finalAmount.toFixed(2)}</span>
        </div>
      </div>

      <!-- NOTES -->
      <div class="notes-section">
        <div class="notes-label">📋 Notes:</div>
        <div class="notes-text">
          Thank you for your order! Please ensure payment is completed as per the selected payment method. For any queries, contact our support team.
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-title">💳 Payment Terms</div>
          <div class="footer-text">Due upon receipt of invoice</div>
        </div>
        <div class="footer-section">
          <div class="footer-title">🔄 Return Policy</div>
          <div class="footer-text">7 days from delivery for defects</div>
        </div>
        <div class="footer-section">
          <div class="footer-title">🚚 Shipping</div>
          <div class="footer-text">Free delivery on orders above ₹5000</div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-bottom-text">Thank you for your business! We appreciate your support.</div>
        <div class="footer-bottom-text">© 2026 Suryadev Seeds. All rights reserved.</div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  };

  /**
   * Handle invoice download/share based on platform
   */
  const handleInvoiceAction = async (order: Order, logoUri?: string) => {
    setLoading(true);
    try {
      const htmlContent = generateInvoiceHTML(order, logoUri);
      const fileName = `Invoice_${order.id}_${new Date().toISOString().split('T')[0]}.pdf`;
      const invoiceNumber = generateInvoiceNumber(order.id);

      if (Platform.OS === 'web') {
        // Web: Open print dialog
        await Print.printToFileAsync({ html: htmlContent });
      } else {
        // Native: Generate PDF and show action options
        const pdf = await Print.printToFileAsync({
          html: htmlContent,
          base64: false,
        });

        const pdfUri = pdf.uri;

        Alert.alert(
          '✓ Invoice Generated',
          'Choose an action for this invoice:',
          [
            {
              text: '📤 Share',
              onPress: async () => {
                try {
                  const { shareAsync } = await import('expo-sharing');
                  await shareAsync(pdfUri, {
                    mimeType: 'application/pdf',
                    dialogTitle: `Share Invoice ${invoiceNumber}`,
                    UTI: 'com.adobe.pdf',
                  });
                } catch (error) {
                  Alert.alert('Error', 'Failed to share invoice');
                }
              },
            },
            {
              text: '💾 Download',
              onPress: async () => {
                try {
                  // On iOS, directly share the PDF instead of saving to internal storage
                  // This allows users to save to Files app, iCloud, or other services
                  if (Platform.OS === 'ios') {
                    await Sharing.shareAsync(pdfUri, {
                      mimeType: 'application/pdf',
                      dialogTitle: `Save Invoice ${invoiceNumber}`,
                      UTI: 'com.adobe.pdf',
                    });
                  } else {
                    // Android: Save to app's document directory
                    const invoicesDir = `${documentDirectory}Invoices`;
                    const destUri = `${invoicesDir}/${fileName}`;
                    
                    // Ensure Invoices directory exists
                    const dirInfo = await getInfoAsync(invoicesDir);
                    
                    if (!dirInfo.exists) {
                      await makeDirectoryAsync(invoicesDir, { intermediates: true });
                    }

                    await copyAsync({
                      from: pdfUri,
                      to: destUri,
                    });

                    Alert.alert(
                      '✓ Success',
                      'Invoice saved to app storage at:\nDocuments > Invoices'
                    );
                  }
                } catch (error) {
                  console.error('Download error:', error);
                  Alert.alert('Error', 'Failed to download invoice');
                }
              },
            },
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error handling invoice:', error);
      Alert.alert('Error', 'Failed to process invoice');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleInvoiceAction,
    generateInvoiceHTML,
  };
};
