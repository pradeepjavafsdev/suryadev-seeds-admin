import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import TabNavigator from "./TabNavigator";
import LoginScreen from "../screens/LoginScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";
import ManageProductsScreen from "../screens/ManageProductsScreen";
import ManageStockScreen from "../screens/ManageStockScreen";
import AddProductScreen from "../screens/AddProductScreen";
import ManageUsersScreen from "../screens/ManageUsersScreen";
import AdminSettingsScreen from "../screens/AdminSettingsScreen";
import CategoryScreen from "../screens/CategoryScreen";
import { Order } from "../types";

type RootStackParamList = {
  Main: undefined;
  OrderDetails: { order: Order };
  ManageProducts: undefined;
  ManageStock: undefined;
  AddProduct: undefined;
  ManageCategories: undefined;
  ManageUsers: undefined;
  AdminSettings: undefined;
  Login: undefined;
} & ParamListBase;

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{
          headerShown: true,
          title: "Order Details",
        }}
      />
      <Stack.Screen
        name="ManageProducts"
        component={ManageProductsScreen}
        options={{
          headerShown: true,
          title: "Manage Products",
        }}
      />
      <Stack.Screen
        name="ManageStock"
        component={ManageStockScreen}
        options={{
          headerShown: true,
          title: "Manage Stock",
        }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          headerShown: true,
          title: "Add Product",
        }}
      />
      <Stack.Screen
        name="ManageCategories"
        component={CategoryScreen}
        options={{
          headerShown: true,
          title: "Manage Categories",
        }}
      />
      <Stack.Screen
        name="ManageUsers"
        component={ManageUsersScreen}
        options={{
          headerShown: true,
          title: "Manage Users",
        }}
      />
      <Stack.Screen
        name="AdminSettings"
        component={AdminSettingsScreen}
        options={{
          headerShown: true,
          title: "Admin Settings",
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
