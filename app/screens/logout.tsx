import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function LogoutScreen() {
  const navigation = useNavigation();
  

  useEffect(() => {

    const handleLogout = async()=>{
      try {
        const token = AsyncStorage.getItem('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post('http://localhost:8080/api/logout' );

        if(response.status === 200){
          delete axios.defaults.headers.common['Authorization'];
          await AsyncStorage.removeItem('userToken');

          setTimeout(() => {  
            navigation.reset({
              index: 0,
              routes: [{ name: 'index' }],
            });
          }, 2000);
        }
        
      } catch (error) {
        
      }
      
    }
    handleLogout()
 
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
