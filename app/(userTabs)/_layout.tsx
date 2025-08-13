import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Importação das telas
import HomeScreen from '../index';
import FeedbackScreen from '../(userTabs)/feedback';
import ExploreScreen from '../(userTabs)/explore';
import RespostasScreen from '../(userTabs)/respostas';
import DepsScreen from '../(userTabs)/deps';
import LoginScreen from '../screens/login';
import UserScreen from '../(userTabs)/user';
import FeedScreen from '../(userTabs)/feed';


const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        drawerStyle: {
          backgroundColor: '#fff',
          width: 250,
        },
      }}
    >
      {/* <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color }) => <IconSymbol size={24} name="home.fill" color={color} />,
        }}
      /> */}
      <Drawer.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          drawerIcon: ({ color }) => <IconSymbol size={24} name="folder.fill" color={color} />,
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={UserScreen}
        options={{
          drawerIcon: ({ color }) => <IconSymbol size={24} name="profile.fill" color={color} />,
        }}
      />
      <Drawer.Screen
        name="Comentários"
        component={FeedbackScreen}
        options={{
          drawerIcon: ({ color }) => <IconSymbol size={24} name="send.fill" color={color} />,
        }}
      />
      <Drawer.Screen
        name="Buscar Comentários"
        component={ExploreScreen}
        options={{
          drawerIcon: ({ color }) => <IconSymbol size={24} name="mycomments.fill" color={color} />,
        }}
      />
      <Drawer.Screen
        name="Respostas"
        component={RespostasScreen}
        options={{
          drawerIcon: ({ color }) => <IconSymbol size={24} name="reply.bubble.fill" color={color} />,
        }}
      />
      {/* <Drawer.Screen
        name="Departamentos"
        component={DepsScreen}
        options={{
          drawerIcon: ({ color }) => <IconSymbol size={24} name="apartment.building.fill" color={color} />,
        }}
      /> */}
      {/* <Drawer.Screen
        name="Login"
        component={LoginScreen}
        options={{
          drawerIcon: ({ color }) => <IconSymbol size={24} name="login.square.fill" color={color} />,
        }}
      /> */}
      
    </Drawer.Navigator>
  );
}
