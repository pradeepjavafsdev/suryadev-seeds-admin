import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../constants/colors";

const AdminSettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Settings</Text>
      {/* TODO: Implement admin settings features */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.backgroundLight,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 16,
  },
});

export default AdminSettingsScreen;
