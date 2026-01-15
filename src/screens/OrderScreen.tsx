import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import { firestore } from "../services/firebase";
import { colors } from "../constants/colors";
import { Order } from "../types";
import { useInvoiceActions } from "../hooks/useInvoiceActions";

// Type assertion to suppress false JSX errors from react-native types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

const OrderScreen = ({ navigation }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const { handleInvoiceAction, loading: invoiceLoading } = useInvoiceActions();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersRef = collection(firestore, "orders");
      const snapshot = await getDocs(ordersRef);
      const fetchedOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      // Sort by orderDate descending (newest first)
      fetchedOrders.sort(
        (a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );

      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", "Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: "pending" | "completed" | "canceled"
  ) => {
    try {
      const orderRef = doc(firestore, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      Alert.alert("Success", `Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order:", error);
      Alert.alert("Error", "Failed to update order status");
    }
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
        return "#999";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✓";
      case "pending":
        return "⏳";
      case "canceled":
        return "✕";
      default:
        return "?";
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const isExpanded = expandedOrderId === item.id;
    const itemCount = item.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
    const orderDate = new Date(item.orderDate).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View style={styles.orderCard}>
        {/* Header */}
        <TouchableOpacity
          style={styles.orderHeader}
          onPress={() => setExpandedOrderId(isExpanded ? null : item.id)}
        >
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.statusIcon}>
                {getStatusIcon(item.status)}
              </Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.orderId}>
                Order #{item.id.slice(0, 8).toUpperCase()}
              </Text>
              <Text style={styles.orderDate}>{orderDate}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.amount}>
              ₹
              {item.finalAmount?.toFixed(2) ||
                item.totalAmount?.toFixed(2) ||
                "0.00"}
            </Text>
            <Text style={styles.expandIcon}>{isExpanded ? "▼" : "▶"}</Text>
          </View>
        </TouchableOpacity>

        {/* Expanded Details */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Customer Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>
                  {item.customerDetails?.name || "N/A"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Mobile:</Text>
                <Text style={styles.value}>
                  {item.customerDetails?.mobileNo || "N/A"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Address:</Text>
                <Text style={[styles.value, { flex: 1, flexWrap: "wrap" }]}>
                  {item.customerDetails?.address || "N/A"}
                </Text>
              </View>
            </View>

            {/* Order By */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Ordered By:</Text>
                <Text style={styles.value}>{item.orderedBy || "Admin"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Payment Method:</Text>
                <Text style={styles.value}>
                  {item.customerDetails?.paymentMethod === "cash"
                    ? "Cash on Delivery"
                    : item.customerDetails?.paymentMethod === "card"
                    ? "Card"
                    : "UPI"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Items:</Text>
                <Text style={styles.value}>{itemCount}</Text>
              </View>
            </View>

            {/* Order Items */}
            {item.items && item.items.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Items Ordered</Text>
                {item.items.map((product, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {product.product.name}
                      </Text>
                      <Text style={styles.itemMeta}>
                        Qty: {product.quantity} × ₹{product.price.toFixed(2)}
                      </Text>
                    </View>
                    <Text style={styles.itemTotal}>
                      ₹{(product.quantity * product.price).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Price Breakdown */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Breakdown</Text>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Subtotal:</Text>
                <Text style={styles.value}>
                  ₹{item.totalAmount?.toFixed(2) || "0.00"}
                </Text>
              </View>
              {item.discount! > 0 && (
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Discount:</Text>
                  <Text style={[styles.value, { color: colors.primary }]}>
                    −₹{item.discount?.toFixed(2) || "0.00"}
                  </Text>
                </View>
              )}
              <View style={[styles.detailRow, styles.finalAmount]}>
                <Text style={styles.label}>Final Amount:</Text>
                <Text style={styles.value}>
                  ₹
                  {item.finalAmount?.toFixed(2) ||
                    item.totalAmount?.toFixed(2) ||
                    "0.00"}
                </Text>
              </View>
            </View>

            {/* Download Invoice Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📄 Invoice</Text>
              <TouchableOpacity
                style={[
                  styles.invoiceButton,
                  invoiceLoading && styles.invoiceButtonDisabled,
                ]}
                onPress={() =>
                  handleInvoiceAction(item, require("../assets/logo.jpg"))
                }
                disabled={invoiceLoading}
              >
                <Text style={styles.invoiceButtonIcon}>📥</Text>
                <Text style={styles.invoiceButtonText}>
                  {invoiceLoading
                    ? "Generating..."
                    : "Download / Share Invoice"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.invoiceHint}>
                Click to download or share invoice via native device options
              </Text>
            </View>

            {/* Status Update */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Update Status</Text>
              <View style={styles.statusButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    item.status === "pending" && styles.statusButtonActive,
                  ]}
                  onPress={() => handleStatusChange(item.id, "pending")}
                >
                  <Text style={styles.statusButtonText}>Pending</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    item.status === "completed" && styles.statusButtonActive,
                  ]}
                  onPress={() => handleStatusChange(item.id, "completed")}
                >
                  <Text style={styles.statusButtonText}>Completed</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    item.status === "canceled" && styles.statusButtonActive,
                  ]}
                  onPress={() => handleStatusChange(item.id, "canceled")}
                >
                  <Text style={styles.statusButtonText}>Canceled</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <Text style={styles.orderCount}>{orders.length}</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>📦</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtext}>Orders will appear here</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  orderCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statusIcon: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: colors.gray,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  expandIcon: {
    fontSize: 14,
    color: colors.gray,
  },
  expandedContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.textLight,
  },
  value: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "right",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textLight,
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 11,
    color: colors.gray,
  },
  itemTotal: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.primary,
  },
  finalAmount: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderBottomWidth: 0,
  },
  statusButtonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  statusButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusButtonText: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.textLight,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray,
  },
  invoiceButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginBottom: 8,
  },
  invoiceButtonDisabled: {
    backgroundColor: "#cccccc",
    opacity: 0.6,
  },
  invoiceButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  invoiceButtonText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
  },
  invoiceHint: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 4,
    fontStyle: "italic",
  },
});

export default OrderScreen;
