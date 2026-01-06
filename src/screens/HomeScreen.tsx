import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDocs, collection, query, where } from "firebase/firestore";
import { firestore } from "../services/firebase";
import { colors } from "../constants/colors";
import { formatCurrency } from "../utils/helpers";
import { Order } from "../types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  OrderDetails: { order: Order };
  Home: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    pendingAmount: 0,
    pendingOrdersCount: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const ordersRef = collection(firestore, "orders");
      const snapshot = await getDocs(ordersRef);
      const allOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      // Filter pending orders
      const pending = allOrders.filter((order) => order.status === "pending");
      const completed = allOrders.filter(
        (order) => order.status === "completed"
      );

      // Calculate totals
      const totalIncome = completed.reduce(
        (sum, order) => sum + (order.finalAmount || order.totalAmount || 0),
        0
      );
      const pendingAmount = pending.reduce(
        (sum, order) => sum + (order.finalAmount || order.totalAmount || 0),
        0
      );

      setPendingOrders(
        pending.sort(
          (a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        )
      );

      setDashboardData({
        totalIncome,
        pendingAmount,
        pendingOrdersCount: pending.length,
        totalOrders: allOrders.length,
      });

      console.log("Dashboard data loaded:", {
        totalIncome,
        pendingAmount,
        pendingOrdersCount: pending.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate("OrderDetails", { order: item })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>
          Order #{item.id.slice(0, 8).toUpperCase()}
        </Text>
        <Text style={styles.orderDate}>
          {new Date(item.orderDate).toLocaleDateString("en-IN")}
        </Text>
      </View>
      <View style={styles.orderInfo}>
        <Text style={styles.customerName} numberOfLines={1}>
          {item.customerDetails?.name || "N/A"}
        </Text>
        <Text style={styles.amount}>
          ₹{(item.finalAmount || item.totalAmount || 0).toFixed(2)}
        </Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.quantity}>
          Items: {item.items?.reduce((sum, i) => sum + i.quantity, 0) || 0}
        </Text>
        <Text style={styles.statusPending}>⏳ Pending</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={pendingOrders}
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
        ListHeaderComponent={
          <View>
            <Text style={styles.hearding_title}>Dashboard</Text>

            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Total Income</Text>
                <Text style={styles.cardValue}>
                  ₹{dashboardData.totalIncome.toFixed(2)}
                </Text>
                <Text style={styles.cardSubtext}>From completed orders</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Pending Amount</Text>
                <Text style={[styles.cardValue, { color: "#ff9800" }]}>
                  ₹{dashboardData.pendingAmount.toFixed(2)}
                </Text>
                <Text style={styles.cardSubtext}>Awaiting collection</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Total Orders</Text>
                <Text style={styles.cardValue}>
                  {dashboardData.totalOrders}
                </Text>
                <Text style={styles.cardSubtext}>All time</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Pending Orders</Text>
                <Text style={[styles.cardValue, { color: "#f44336" }]}>
                  {dashboardData.pendingOrdersCount}
                </Text>
                <Text style={styles.cardSubtext}>Requires action</Text>
              </View>
            </View>

            <Text style={styles.hearding_title}>Pending Orders</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✓</Text>
            <Text style={styles.emptyText}>No Pending Orders</Text>
            <Text style={styles.emptySubtext}>All orders are completed!</Text>
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
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textLight,
  },
  hearding_title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 16,
    paddingHorizontal: 4,
    color: colors.textLight,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  card: {
    width: Dimensions.get("window").width / 2 - 20,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 6,
    fontWeight: "500",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 11,
    color: colors.gray,
    fontStyle: "italic",
  },
  orderList: {
    flex: 1,
  },
  orderItem: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 15,
    color: colors.textLight,
  },
  orderDate: {
    color: colors.gray,
    fontSize: 12,
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  customerName: {
    fontWeight: "600",
    fontSize: 14,
    color: colors.textLight,
    flex: 1,
  },
  amount: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.primary,
    marginLeft: 8,
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
  },
  quantity: {
    fontSize: 12,
    color: colors.gray,
  },
  statusPending: {
    color: "#ff9800",
    fontWeight: "600",
    fontSize: 12,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray,
  },
});

export default HomeScreen;
