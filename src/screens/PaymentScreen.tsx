import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";
import { CartItem, CustomerDetails, Order } from "../types";
import Button from "../components/common/Button";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../services/firebase";
import { getAuth } from "firebase/auth";

const PaymentScreen = ({ navigation, route }: any) => {
  const {
    cartItems,
    customerDetails,
    subtotal,
    discount,
    finalAmount,
    paymentMethod,
  } = route.params;

  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [upiId, setUpiId] = useState("");

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const validatePaymentDetails = () => {
    if (paymentMethod === "card") {
      if (
        !cardNumber.replace(/\s/g, "") ||
        cardNumber.replace(/\s/g, "").length !== 16
      ) {
        Alert.alert(
          "Invalid Card",
          "Please enter a valid 16-digit card number"
        );
        return false;
      }
      if (!cardExpiry || cardExpiry.length !== 5) {
        Alert.alert("Invalid Expiry", "Please enter expiry in MM/YY format");
        return false;
      }
      if (!cardCVV || cardCVV.length !== 3) {
        Alert.alert("Invalid CVV", "Please enter a valid 3-digit CVV");
        return false;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId.trim() || !upiId.includes("@")) {
        Alert.alert("Invalid UPI", "Please enter a valid UPI ID");
        return false;
      }
    }
    return true;
  };

  const handleCompletePayment = async () => {
    if (!validatePaymentDetails()) {
      return;
    }

    setLoading(true);
    try {
      // Create order object
      const orderData: Omit<Order, "id"> = {
        userId: currentUser?.uid || "admin",
        orderedBy: currentUser?.displayName || "Admin",
        seedId: "", // Will be populated per item
        quantity: cartItems.reduce(
          (sum: number, item: CartItem) => sum + item.quantity,
          0
        ),
        orderDate: new Date().toISOString(),
        status: "pending",
        items: cartItems,
        customerDetails: customerDetails,
        totalAmount: subtotal,
        discount: discount,
        finalAmount: finalAmount,
      };

      // Add order to Firebase
      const ordersRef = collection(firestore, "orders");
      const docRef = await addDoc(ordersRef, orderData);

      Alert.alert("Success", "Order placed successfully!", [
        {
          text: "View Order",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "Main",
                  params: {
                    orderId: docRef.id,
                    orderPlaced: true,
                  },
                },
              ],
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted.slice(0, 19));
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      const formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      setCardExpiry(formatted.slice(0, 5));
    } else {
      setCardExpiry(cleaned);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Subtotal:</Text>
              <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Discount:</Text>
              <Text style={[styles.value, { color: colors.primary }]}>
                −₹{discount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text
                style={[styles.label, { fontWeight: "bold", fontSize: 15 }]}
              >
                Final Amount:
              </Text>
              <Text
                style={[
                  styles.value,
                  { fontWeight: "bold", fontSize: 16, color: colors.primary },
                ]}
              >
                ₹{finalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{customerDetails.name}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mobile:</Text>
              <Text style={styles.infoValue}>{customerDetails.mobileNo}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={[styles.infoValue, { flex: 1 }]}>
                {customerDetails.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethodBox}>
            <Text style={styles.paymentMethodText}>
              {paymentMethod === "cash"
                ? "💵 Cash on Delivery"
                : paymentMethod === "card"
                ? "💳 Debit/Credit Card"
                : "📱 UPI"}
            </Text>
          </View>
        </View>

        {/* Payment Details Form */}
        {paymentMethod !== "cash" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {paymentMethod === "card" ? "Card Details" : "UPI Details"}
            </Text>

            {paymentMethod === "card" ? (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Card Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#999"
                    value={cardNumber}
                    onChangeText={formatCardNumber}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                </View>

                <View style={styles.rowContainer}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel}>Expiry (MM/YY)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      placeholderTextColor="#999"
                      value={cardExpiry}
                      onChangeText={formatExpiry}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>

                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>CVV</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      placeholderTextColor="#999"
                      value={cardCVV}
                      onChangeText={setCardCVV}
                      keyboardType="numeric"
                      maxLength={3}
                      secureTextEntry
                    />
                  </View>
                </View>

                <View style={styles.warningBox}>
                  <Text style={styles.warningIcon}>⚠️</Text>
                  <Text style={styles.warningText}>
                    This is a demo. Card details are not actually processed.
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>UPI ID</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="yourname@upi"
                    placeholderTextColor="#999"
                    value={upiId}
                    onChangeText={setUpiId}
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.warningBox}>
                  <Text style={styles.warningIcon}>⚠️</Text>
                  <Text style={styles.warningText}>
                    This is a demo. UPI transactions are not actually processed.
                  </Text>
                </View>
              </>
            )}
          </View>
        )}

        {paymentMethod === "cash" && (
          <View style={styles.section}>
            <View style={styles.infoBox}>
              <Text style={styles.infoMessage}>
                ✓ Order will be delivered to the customer and payment will be
                collected on delivery.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          color="#f0f0f0"
          disabled={loading}
        />
        <Button
          title={loading ? "Processing..." : "Complete Payment"}
          onPress={handleCompletePayment}
          color={colors.primary}
          disabled={loading}
        />
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Processing payment...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
  },
  backButton: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 12,
  },
  summaryBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: colors.textLight,
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textLight,
  },
  infoBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.textLight,
  },
  infoValue: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: "right",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  infoMessage: {
    fontSize: 14,
    color: colors.primary,
    lineHeight: 20,
    fontWeight: "500",
  },
  paymentMethodBox: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textLight,
    backgroundColor: "white",
  },
  rowContainer: {
    flexDirection: "row",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ffc107",
  },
  warningIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: "#856404",
    lineHeight: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingText: {
    marginTop: 16,
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default PaymentScreen;
