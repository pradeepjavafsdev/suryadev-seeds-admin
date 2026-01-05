// filepath: /suryadev-seeds-admin/suryadev-seeds-admin/src/screens/CategoryScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getDocs } from "firebase/firestore";
// Ensure this path matches your actual file structure
import { colRef } from "../services/firebase";

// 1. Define the interface locally if not already imported
// (Modify this to match your actual Firestore document fields)
export interface Category {
  id: string;
  name?: string; // Replace 'name' with whatever field your Firestore doc uses
  title?: string;
}

const CategoryScreen = () => {
  // Initialize as an empty array
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(colRef);

        // Map the data correctly
        const filteredData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];

        setCategories(filteredData);
        console.log("Fetched categories:", filteredData);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 2. Fix the renderItem destructuring
  // The argument is { item }, where 'item' is a single Category object
  const renderItem = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      {/* Replace 'item.name' with the actual field name from your Firestore data */}
      <Text style={styles.categoryText}>
        {item.name || item.title || "Unnamed Category"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        // Add this if list is empty
        ListEmptyComponent={<Text>No categories found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1A237E",
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
    marginBottom: 8,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 18,
    color: "#333",
  },
});

export default CategoryScreen;
