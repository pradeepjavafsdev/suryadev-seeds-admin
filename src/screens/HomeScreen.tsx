import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { colors } from "../constants/colors";
import { formatCurrency } from "../utils/helpers";

const HomeScreen = () => {
  // Mock data - Replace with actual data from Firebase later
  const dashboardData = {
    totalIncome: 45000,
    pendingAmount: 12500,
    pendingOrders: 23,
  };

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
});

export default HomeScreen;
