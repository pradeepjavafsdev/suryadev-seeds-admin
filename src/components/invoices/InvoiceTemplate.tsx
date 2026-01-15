import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { colors } from "../../constants/colors";

export interface InvoiceTemplateProps {
  children: React.ReactNode;
  invoiceNumber: string;
  invoiceDate: string;
  logoUri?: string;
}

/**
 * Reusable Invoice Template Component
 * Provides consistent header and footer across all document types
 * Body content is passed as children for flexibility
 *
 * Features:
 * - Company logo and details in header
 * - Invoice metadata (number, date)
 * - Flexible body content
 * - Standardized footer with terms and policy
 */
const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  children,
  invoiceNumber,
  invoiceDate,
  logoUri,
}) => {
  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {logoUri && (
            <Image
              source={{ uri: logoUri }}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Suryadev Seeds</Text>
            <Text style={styles.companyTagline}>
              Premium Quality Seeds & Agricultural Products
            </Text>
            <Text style={styles.companyContact}>
              Email: info@suryadeveseeds.com | Phone: +91-XXXXXXXXXX
            </Text>
            <Text style={styles.companyAddress}>
              Address: Suryadev Seeds, City, State - PIN
            </Text>
          </View>
        </View>

        <View style={styles.invoiceMeta}>
          <Text style={styles.invoiceLabel}>INVOICE</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Invoice #</Text>
            <Text style={styles.metaValue}>{invoiceNumber}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>{invoiceDate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ===== BODY ===== */}
      <View style={styles.body}>{children}</View>

      {/* ===== FOOTER ===== */}
      <View style={styles.divider} />
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>💳 Payment Terms</Text>
            <Text style={styles.footerText}>Due upon receipt of invoice</Text>
          </View>
          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>🔄 Return Policy</Text>
            <Text style={styles.footerText}>
              7 days from delivery for defects
            </Text>
          </View>
          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>🚚 Shipping</Text>
            <Text style={styles.footerText}>
              Free delivery on orders above ₹5000
            </Text>
          </View>
        </View>

        <View style={styles.footerBottom}>
          <Text style={styles.footerBottomText}>
            Thank you for your business! We appreciate your support.
          </Text>
          <Text style={styles.footerBottomText}>
            © 2026 Suryadev Seeds. All rights reserved.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 20,
    minHeight: "100%",
  },
  // ===== HEADER STYLES =====
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.deepGreen,
    marginBottom: 4,
  },
  companyTagline: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
  },
  companyContact: {
    fontSize: 11,
    color: colors.gray,
    marginBottom: 2,
  },
  companyAddress: {
    fontSize: 11,
    color: colors.gray,
  },
  invoiceMeta: {
    alignItems: "flex-end",
  },
  invoiceLabel: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.deepGreen,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  metaLabel: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: "600",
    marginRight: 16,
  },
  metaValue: {
    fontSize: 11,
    color: colors.deepGreen,
    fontWeight: "bold",
  },
  divider: {
    height: 2,
    backgroundColor: colors.deepGreen,
    marginVertical: 16,
  },
  // ===== BODY STYLES =====
  body: {
    marginVertical: 16,
  },
  // ===== FOOTER STYLES =====
  footer: {
    marginTop: 24,
    paddingTop: 16,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
  },
  footerSection: {
    flex: 1,
    marginHorizontal: 6,
  },
  footerTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.deepGreen,
    marginBottom: 4,
  },
  footerText: {
    fontSize: 10,
    color: colors.gray,
    lineHeight: 14,
  },
  footerBottom: {
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerBottomText: {
    fontSize: 10,
    color: colors.gray,
    marginBottom: 4,
    textAlign: "center",
  },
});

export default InvoiceTemplate;
