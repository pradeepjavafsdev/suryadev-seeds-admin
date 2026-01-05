import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./services/firebase"; // Adjust path if needed

import AppNavigator from "./navigation/AppNavigator"; // Your main app with tabs
import LoginScreen from "./screens/LoginScreen"; // The new login screen

import { ActivityIndicator, View } from "react-native"; // For initial loading screen

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // This hook listens for changes in Firebase auth state (login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) {
        setInitializing(false);
      }
    });

    // Cleanup the listener when the component unmounts
    return unsubscribe;
  }, []);

  // Show a loading screen while Firebase is checking if the user is already logged in
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        // If 'user' object exists, the user is signed in. Show the main app.
        <AppNavigator />
      ) : (
        // If 'user' is null, the user is not signed in. Show the login screen.
        <LoginScreen />
      )}
    </NavigationContainer>
  );
}
