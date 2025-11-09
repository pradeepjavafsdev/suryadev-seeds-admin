import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Order } from "../types";
import Button from "../components/common/Button";
import { colors } from "../constants/colors";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  OrderDetails: { order: Order };
};

type OrderDetailsRouteProp = RouteProp<RootStackParamList, "OrderDetails">;
type OrderDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "OrderDetails"
>;

type OrderDetailsScreenProps = {
  route: OrderDetailsRouteProp;
  navigation: OrderDetailsNavigationProp;
};

const OrderDetailsScreen = ({ route, navigation }: OrderDetailsScreenProps) => {
  const { order } = route.params;

  const handleAccept = () => {
    // TODO: Implement Firebase update
    console.log("Order accepted:", order.id);
    navigation.goBack();
  };

  const handleReject = () => {
    // TODO: Implement Firebase update
    console.log("Order rejected:", order.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Order ID:</Text>
          <Text style={styles.value}>#{order.id}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>{order.userId}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Seed ID:</Text>
          <Text style={styles.value}>{order.seedId}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>{order.quantity}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Order Date:</Text>
          <Text style={styles.value}>{order.orderDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Accept Order"
          onPress={handleAccept}
          color={colors.primary}
        />
        <View style={styles.buttonSpacer} />
        <Button title="Reject Order" onPress={handleReject} color="#d32f2f" />
      </View>
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
    marginBottom: 24,
  },
  detailsContainer: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: "auto",
  },
  buttonSpacer: {
    height: 16,
  },
});

export default OrderDetailsScreen;
