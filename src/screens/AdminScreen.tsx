import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  ManageProducts: undefined;
  ManageStock: undefined;
  AddProduct: undefined;
  ManageCategories: undefined;
  ManageUsers: undefined;
  AdminSettings: undefined;
};

type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface AdminFeature {
  id: string;
  title: string;
  icon: string;
  screen: keyof RootStackParamList;
}

const adminFeatures: AdminFeature[] = [
  { id: "1", title: "Manage Products", icon: "leaf", screen: "ManageProducts" },
  { id: "2", title: "Manage Stock", icon: "cube", screen: "ManageStock" },
  {
    id: "3",
    title: "Add New Product",
    icon: "add-circle",
    screen: "AddProduct",
  },
  { id: "4", title: "Categories", icon: "grid", screen: "ManageCategories" },
  { id: "5", title: "Users", icon: "people", screen: "ManageUsers" },
  { id: "6", title: "Settings", icon: "settings", screen: "AdminSettings" },
];

const AdminScreen = () => {
  const navigation = useNavigation<AdminScreenNavigationProp>();

  const renderFeatureItem = (feature: AdminFeature) => (
    <TouchableOpacity
      key={feature.id}
      style={styles.featureItem}
      onPress={() => navigation.navigate(feature.screen)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={feature.icon as any} size={32} color={colors.primary} />
      </View>
      <Text style={styles.featureTitle}>{feature.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Admin Panel</Text>
      <View style={styles.featuresGrid}>
        {adminFeatures.map(renderFeatureItem)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    color: colors.primary,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  featureItem: {
    width: "50%",
    padding: 8,
  },
  iconContainer: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  featureTitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
});

export default AdminScreen;
