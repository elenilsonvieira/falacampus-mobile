import React, { useContext, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '@/context/AuthContext';

export default function LogoutScreen() {
  const {logout} = useContext(AuthContext)
  

  useEffect(() => {
    logout()
 
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
