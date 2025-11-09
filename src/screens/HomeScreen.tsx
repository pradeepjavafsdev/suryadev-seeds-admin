import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { colors } from "../constants/colors";
import { formatCurrency } from "../utils/helpers";
import { Order } from "../types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  OrderDetails: { order: Order & { customerName: string; amount: number } };
  Home: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // Mock data - Replace with actual data from Firebase later
  const dashboardData = {
    totalIncome: 45000,
    pendingAmount: 12500,
    pendingOrders: 23,
  };

  // Mock orders data - Replace with Firebase data later
  const openOrders: (Order & { customerName: string; amount: number })[] = [
    {
      id: "1",
      userId: "user1",
      customerName: "John Doe",
      seedId: "seed1",
      quantity: 50,
      amount: 2500,
      orderDate: "2025-11-08",
      status: "pending",
    },
    {
      id: "2",
      userId: "user2",
      customerName: "Jane Smith",
      seedId: "seed2",
      quantity: 100,
      amount: 4800,
      orderDate: "2025-11-09",
      status: "pending",
    },
  ];

  const renderOrderItem = ({
    item,
  }: {
    item: Order & { customerName: string; amount: number };
  }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate("OrderDetails", { order: item })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={styles.orderDate}>{item.orderDate}</Text>
      </View>
      <View style={styles.orderInfo}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
      </View>
      <View style={styles.orderDetails}>
        <Text>Quantity: {item.quantity}</Text>
        <Text style={styles.statusPending}>• Pending</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.hearding_title}>Dashboard:</Text>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Income</Text>
          <Text style={styles.cardValue}>
            {formatCurrency(dashboardData.totalIncome)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pending Amount</Text>
          <Text style={styles.cardValue}>
            {formatCurrency(dashboardData.pendingAmount)}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Credit</Text>
          <Text style={styles.cardValue}>
            {formatCurrency(dashboardData.pendingAmount)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pending Orders</Text>
          <Text style={styles.cardValue}>{dashboardData.pendingOrders}</Text>
        </View>
      </View>

      <Text style={styles.hearding_title}>Open Orders:</Text>
      <FlatList
        data={openOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        style={styles.orderList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  card: {
    width: Dimensions.get("window").width / 2 - 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  hearding_title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 16,
  },
  orderList: {
    flex: 1,
  },
  orderItem: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 16,
  },
  orderDate: {
    color: "#666",
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  customerName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  amount: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.primary,
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusPending: {
    color: "#f57c00",
    fontWeight: "500",
  },
});

export default HomeScreen;
