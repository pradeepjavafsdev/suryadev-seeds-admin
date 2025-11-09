// filepath: /suryadev-seeds-admin/suryadev-seeds-admin/src/screens/OrderScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrderScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Screen</Text>
      <Text>Manage your orders here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Change to a dark color for dark mode
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default OrderScreen;