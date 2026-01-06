import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";
import { CartItem, CustomerDetails } from "../types";
import Button from "../components/common/Button";
import { Picker } from "@react-native-picker/picker";

const CheckoutScreen = ({ navigation, route }: any) => {
  const { cartItems, subtotal } = route.params;

  const [customerName, setCustomerName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi">(
    "cash"
  );
  const [finalDiscount, setFinalDiscount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const summary = useMemo(() => {
    const discount = parseFloat(finalDiscount) || 0;
    const finalAmount = subtotal - discount;
    return { discount, finalAmount };
  }, [subtotal, finalDiscount]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!mobileNo.trim()) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobileNo.replace(/\D/g, ""))) {
      newErrors.mobileNo = "Invalid mobile number (10 digits required)";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fill all required fields correctly"
      );
      return;
    }

    const customerDetails: CustomerDetails = {
      name: customerName,
      mobileNo,
      address,
      paymentMethod,
      finalDiscount: parseFloat(finalDiscount) || 0,
    };

    navigation.navigate("Payment", {
      cartItems,
      customerDetails,
      subtotal,
      discount: summary.discount,
      finalAmount: summary.finalAmount,
      paymentMethod,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Order Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Items:</Text>
                <Text style={styles.value}>
                  {cartItems.reduce(
                    (sum: number, item: CartItem) => sum + item.quantity,
                    0
                  )}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Subtotal:</Text>
                <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Discount:</Text>
                <Text style={[styles.value, { color: colors.primary }]}>
                  −₹{summary.discount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={[styles.label, { fontWeight: "bold" }]}>
                  Final Amount:
                </Text>
                <Text
                  style={[
                    styles.value,
                    {
                      fontWeight: "bold",
                      color: colors.primary,
                      fontSize: 16,
                    },
                  ]}
                >
                  ₹{summary.finalAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Customer Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Details</Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Full Name *</Text>
              <TextInput
                style={[styles.input, errors.customerName && styles.inputError]}
                placeholder="Enter customer name"
                placeholderTextColor="#999"
                value={customerName}
                onChangeText={setCustomerName}
              />
              {errors.customerName && (
                <Text style={styles.errorText}>{errors.customerName}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Mobile Number *</Text>
              <TextInput
                style={[styles.input, errors.mobileNo && styles.inputError]}
                placeholder="Enter 10-digit mobile number"
                placeholderTextColor="#999"
                value={mobileNo}
                onChangeText={setMobileNo}
                keyboardType="phone-pad"
              />
              {errors.mobileNo && (
                <Text style={styles.errorText}>{errors.mobileNo}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Address *</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.address && styles.inputError,
                ]}
                placeholder="Enter complete address"
                placeholderTextColor="#999"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={4}
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}
            </View>
          </View>

          {/* Payment Method Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={paymentMethod}
                onValueChange={(itemValue) =>
                  setPaymentMethod(itemValue as "cash" | "card" | "upi")
                }
                style={styles.picker}
              >
                <Picker.Item label="Cash on Delivery" value="cash" />
                <Picker.Item label="Debit/Credit Card" value="card" />
                <Picker.Item label="UPI" value="upi" />
              </Picker>
            </View>
          </View>

          {/* Discount Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Final Discount (Optional)</Text>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Discount Amount (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter discount amount"
                placeholderTextColor="#999"
                value={finalDiscount}
                onChangeText={setFinalDiscount}
                keyboardType="decimal-pad"
              />
              <Text style={styles.helperText}>
                This will be deducted from the total amount
              </Text>
            </View>
          </View>

          {/* Order Items Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {cartItems.map((item: CartItem, index: number) => (
              <View key={item.id} style={styles.itemPreview}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  <Text style={styles.itemQuantity}>
                    Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  ₹{(item.quantity * item.price).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          color="#f0f0f0"
        />
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          color={colors.primary}
        />
      </View>
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
  inputError: {
    borderColor: "#d32f2f",
  },
  textArea: {
    textAlignVertical: "top",
    minHeight: 100,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "white",
    overflow: "hidden",
  },
  picker: {
    color: colors.textLight,
  },
  itemPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    color: colors.gray,
  },
  itemTotal: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.primary,
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
});

export default CheckoutScreen;
