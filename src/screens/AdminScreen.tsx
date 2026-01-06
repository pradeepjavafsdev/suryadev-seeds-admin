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
  ManageUsers: undefined;
  AdminSettings: undefined;
  Products: { cart?: any[] };
};

type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface AdminFeature {
  id: string;
  title: string;
  icon: string;
  screen?: keyof RootStackParamList;
  onPress?: () => void;
  isHighlight?: boolean;
}

const AdminScreen = () => {
  const navigation = useNavigation<AdminScreenNavigationProp>();

  const adminFeatures: AdminFeature[] = [
    {
      id: "0",
      title: "Create Order",
      icon: "cart",
      screen: "Products",
      isHighlight: true,
    },
    {
      id: "1",
      title: "Manage Products",
      icon: "leaf",
      screen: "ManageProducts",
    },
    { id: "2", title: "Manage Stock", icon: "cube", screen: "ManageStock" },
    {
      id: "3",
      title: "Add New Product",
      icon: "add-circle",
      screen: "AddProduct",
    },
    { id: "4", title: "Users", icon: "people", screen: "ManageUsers" },
    { id: "5", title: "Settings", icon: "settings", screen: "AdminSettings" },
  ];

  const handleNavigate = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen, {} as any);
  };

  const renderFeatureItem = (feature: AdminFeature) => (
    <TouchableOpacity
      key={feature.id}
      style={[
        styles.featureItem,
        feature.isHighlight && styles.featureItemHighlight,
      ]}
      onPress={() => {
        if (feature.screen) {
          handleNavigate(feature.screen);
        } else if (feature.onPress) {
          feature.onPress();
        }
      }}
    >
      <View
        style={[
          styles.iconContainer,
          feature.isHighlight && styles.iconContainerHighlight,
        ]}
      >
        <Ionicons
          name={feature.icon as any}
          size={32}
          color={feature.isHighlight ? "white" : colors.primary}
        />
      </View>
      <Text
        style={[
          styles.featureTitle,
          feature.isHighlight && styles.featureTitleHighlight,
        ]}
      >
        {feature.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <Text style={styles.headerSubtext}>Manage your business</Text>
      </View>
      <View style={styles.featuresGrid}>
        {adminFeatures.map(renderFeatureItem)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  headerSubtext: {
    fontSize: 14,
    color: colors.gray,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  featureItem: {
    width: "50%",
    padding: 8,
  },
  featureItemHighlight: {
    width: "100%",
  },
  iconContainer: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  iconContainerHighlight: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    paddingVertical: 24,
  },
  featureTitle: {
    textAlign: "center",
    fontSize: 14,
    color: colors.textLight,
    fontWeight: "500",
  },
  featureTitleHighlight: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.primary,
  },
});

export default AdminScreen;
