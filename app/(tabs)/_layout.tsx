import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="feedback"
        options={{
          title: 'Comentários',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bubble.left.and.bubble.right.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Meus Comentários',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle.fill" color={color} />,
        }}
      />
       <Tabs.Screen
        name="respostas"
        options={{
          title: 'Respostas',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="arrowshape.turn.up.left.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="criarDep"
        options={{
          title: 'Criar Departamento',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.rectangle.fill.on.rectangle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="deps"
        options={{
          title: 'Departamentos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="building.fill" color={color} />,
        }}
      />
       <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="arrow.right.square.fill" color={color} />,
        }}
      />
    </Tabs>
    
  );
}