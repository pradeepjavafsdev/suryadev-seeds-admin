import { Platform, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { Order } from '../types';

/**
 * PDF Generation and Handling Utility
 * Features:
 * - Generate PDF from HTML invoice template
 * - Handle download/share on native (iOS/Android)
 * - Handle print on web
 * - Create timestamped filenames
 */

interface PDFGenerationOptions {
  order: Order;
  logoUri?: string;
  companyName?: string;
  htmlContent: string;
}

/**
 * Convert HTML invoice to PDF and handle platform-specific actions
 */
export const generateAndHandleInvoicePDF = async (
  options: PDFGenerationOptions
): Promise<void> => {
  try {
    const { order, htmlContent } = options;
    const fileName = `Invoice_${order.id}_${new Date().toISOString().split('T')[0]}.pdf`;

    if (Platform.OS === 'web') {
      // Web: Print to PDF
      await handleWebPrint(htmlContent, fileName);
    } else {
      // Native: Generate PDF and show share/download options
      await handleNativePDF(htmlContent, fileName, order.id);
    }
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    Alert.alert('Error', 'Failed to generate invoice PDF');
  }
};

/**
 * Handle PDF generation and sharing on native platforms (iOS/Android)
 */
const handleNativePDF = async (
  htmlContent: string,
  fileName: string,
  orderId: string
): Promise<void> => {
  try {
    // Generate PDF from HTML
    const pdf = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    const pdfUri = pdf.uri;

    // Show action sheet with download/share options
    Alert.alert('Invoice Generated', 'What would you like to do?', [
      {
        text: 'Share',
        onPress: async () => {
          await Sharing.shareAsync(pdfUri, {
            mimeType: 'application/pdf',
            dialogTitle: `Share Invoice ${orderId}`,
            UTI: 'com.adobe.pdf',
          });
        },
      },
      {
        text: 'Download',
        onPress: async () => {
          await downloadPDF(pdfUri, fileName);
        },
      },
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  } catch (error) {
    console.error('Error generating native PDF:', error);
    throw error;
  }
};

/**
 * Download PDF to device storage (Downloads folder)
 */
const downloadPDF = async (
  pdfUri: string,
  fileName: string
): Promise<void> => {
  try {
    const downloadsDir = `${FileSystem.documentDirectory}../Downloads`;
    
    // Ensure Downloads directory exists
    const dirInfo = await FileSystem.getInfoAsync(downloadsDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
    }

    const destinationUri = `${downloadsDir}/${fileName}`;

    // Copy PDF to downloads directory
    await FileSystem.copyAsync({
      from: pdfUri,
      to: destinationUri,
    });

    Alert.alert(
      '✓ Success',
      `Invoice downloaded to Downloads folder`,
      [{ text: 'OK' }]
    );
  } catch (error) {
    console.error('Error downloading PDF:', error);
    Alert.alert('Error', 'Failed to download invoice');
    throw error;
  }
};

/**
 * Handle printing on web platform
 */
const handleWebPrint = async (
  htmlContent: string,
  fileName: string
): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      // For web, use the browser's print dialog
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  } catch (error) {
    console.error('Error printing invoice:', error);
    Alert.alert('Error', 'Failed to print invoice');
    throw error;
  }
};

/**
 * Generate HTML content for invoice PDF
 */
export const generateInvoiceHTML = (invoiceComponent: React.ReactElement): string => {
  // This will be called from the component to convert React component to HTML
  // For actual implementation, you might use react-native-html-to-pdf or similar
  return '';
};

/**
 * Format date for invoice
 */
export const formatInvoiceDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Generate unique invoice number
 */
export const generateInvoiceNumber = (orderId: string): string => {
  const timestamp = new Date().getTime().toString().slice(-6);
  return `INV-${new Date().getFullYear()}-${timestamp}`;
};
