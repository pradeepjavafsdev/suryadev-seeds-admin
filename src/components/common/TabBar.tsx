// filepath: /suryadev-seeds-admin/suryadev-seeds-admin/src/components/common/TabBar.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TabBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home-outline" size={24} color="deepgreen" />
        <Text style={styles.tabText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Category')}>
        <Ionicons name="list-outline" size={24} color="deepgreen" />
        <Text style={styles.tabText}>Category</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Order')}>
        <Ionicons name="cart-outline" size={24} color="deepgreen" />
        <Text style={styles.tabText}>Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 10,
  },
  tabText: {
    color: 'deepgreen',
    fontSize: 12,
  },
});

export default TabBar;