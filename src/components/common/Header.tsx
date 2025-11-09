// filepath: /suryadev-seeds-admin/suryadev-seeds-admin/src/components/common/Header.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/colors';

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </TouchableOpacity>
      <Text style={styles.title}>Suryadev Seeds</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Image source={require('../../assets/avatar.png')} style={styles.avatar} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: colors.background,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  avatar: {
    width: 40,
    height: 40,
  },
});

export default Header;