import React, { useContext, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function LogoutScreen() {
  const {logout} = useAuth()
  

  useEffect(() => {
    logout()
 
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
