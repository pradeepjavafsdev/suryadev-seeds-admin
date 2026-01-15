import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Order, CartItem } from "../../types";
import { colors } from "../../constants/colors";

interface InvoiceContentProps {
  order: Order;
}

/**
 * Invoice Content Component
 * Displays order details, customer info, items, and price breakdown
 * Used as the body content in InvoiceTemplate
 */
const InvoiceContent: React.FC<InvoiceContentProps> = ({ order }) => {
  const calculateTotals = () => {
    const subtotal = order.totalAmount || 0;
    const discount = order.discount || 0;
    const finalAmount = order.finalAmount || subtotal - discount;
    return { subtotal, discount, finalAmount };
  };

  const { subtotal, discount, finalAmount } = calculateTotals();
  const itemCount =
    order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <View style={styles.container}>
      {/* BILL TO SECTION */}
      <View style={styles.billToSection}>
        <View style={styles.billColumn}>
          <Text style={styles.sectionLabel}>BILL TO</Text>
          <Text style={styles.customerName}>
            {order.customerDetails?.name || "N/A"}
          </Text>
          <Text style={styles.customerDetail}>
            📞 {order.customerDetails?.mobileNo || "N/A"}
          </Text>
          <Text style={styles.customerDetail}>
            📍 {order.customerDetails?.address || "N/A"}
          </Text>
        </View>

        <View style={styles.billColumn}>
          <Text style={styles.sectionLabel}>ORDER DETAILS</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Date:</Text>
            <Text style={styles.detailValue}>
              {new Date(order.orderDate).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text
              style={[
                styles.detailValue,
                { color: getStatusColor(order.status) },
              ]}
            >
              {order.status?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment:</Text>
            <Text style={styles.detailValue}>
              {formatPaymentMethod(order.customerDetails?.paymentMethod)}
            </Text>
          </View>
        </View>
      </View>

      {/* ITEMS TABLE */}
      <View style={styles.itemsSection}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.itemCol]}>Item</Text>
          <Text style={[styles.tableHeaderCell, styles.qtyCol]}>Qty</Text>
          <Text style={[styles.tableHeaderCell, styles.priceCol]}>Price</Text>
          <Text style={[styles.tableHeaderCell, styles.totalCol]}>Total</Text>
        </View>

        {order.items && order.items.length > 0 ? (
          order.items.map((item: CartItem, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text
                style={[styles.tableCell, styles.itemCol]}
                numberOfLines={2}
              >
                {item.product.name}
              </Text>
              <Text style={[styles.tableCell, styles.qtyCol]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCell, styles.priceCol]}>
                ₹{item.price.toFixed(2)}
              </Text>
              <Text style={[styles.tableCell, styles.totalCol, styles.bold]}>
                ₹{(item.quantity * item.price).toFixed(2)}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.tableRow}>
            <Text style={styles.noItems}>No items found</Text>
          </View>
        )}
      </View>

      {/* PRICE BREAKDOWN */}
      <View style={styles.priceBreakdown}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>
            Subtotal ({itemCount} items)
          </Text>
          <Text style={styles.breakdownValue}>₹{subtotal.toFixed(2)}</Text>
        </View>

        {discount > 0 && (
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.primary }]}>
              Discount (−)
            </Text>
            <Text style={[styles.breakdownValue, { color: colors.primary }]}>
              −₹{discount.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={[styles.breakdownRow, styles.finalAmountRow]}>
          <Text style={styles.finalLabel}>FINAL AMOUNT</Text>
          <Text style={styles.finalValue}>₹{finalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* NOTES */}
      <View style={styles.notesSection}>
        <Text style={styles.notesLabel}>📋 Notes:</Text>
        <Text style={styles.notesText}>
          Thank you for your order! Please ensure payment is completed as per
          the selected payment method. For any queries, contact our support
          team.
        </Text>
      </View>
    </View>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "#4caf50";
    case "pending":
      return "#ff9800";
    case "canceled":
      return "#f44336";
    default:
      return colors.gray;
  }
};

const formatPaymentMethod = (method?: string) => {
  switch (method) {
    case "cash":
      return "Cash on Delivery";
    case "card":
      return "Card Payment";
    case "upi":
      return "UPI Payment";
    default:
      return "N/A";
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  // BILL TO SECTION
  billToSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 24,
  },
  billColumn: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.deepGreen,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 4,
  },
  customerDetail: {
    fontSize: 11,
    color: colors.gray,
    marginBottom: 3,
    lineHeight: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: "bold",
  },
  // ITEMS TABLE
  itemsSection: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.deepGreen,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 11,
    textAlign: "center",
  },
  itemCol: {
    flex: 2,
    textAlign: "left",
  },
  qtyCol: {
    flex: 0.8,
  },
  priceCol: {
    flex: 1,
  },
  totalCol: {
    flex: 1.2,
    textAlign: "right",
    paddingRight: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: colors.white,
  },
  tableCell: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
    color: colors.deepGreen,
  },
  noItems: {
    fontSize: 12,
    color: colors.gray,
    textAlign: "center",
    paddingVertical: 20,
  },
  // PRICE BREAKDOWN
  priceBreakdown: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  breakdownLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: "500",
  },
  breakdownValue: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: "600",
  },
  finalAmountRow: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
    backgroundColor: colors.deepGreen,
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginHorizontal: -12,
    marginBottom: -12,
    borderRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  finalLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.white,
  },
  finalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.white,
  },
  // NOTES SECTION
  notesSection: {
    backgroundColor: "#f0f7ff",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.deepGreen,
  },
  notesLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.deepGreen,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 10,
    color: colors.gray,
    lineHeight: 14,
  },
});

export default InvoiceContent;
