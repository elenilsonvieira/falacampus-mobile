import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import AuthContextProvider from '@/context/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthContextProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          

          <Stack.Screen 
            name ="(userTabs)"  
            options={{
              headerShown: false ,
              
              }}
          />
          <Stack.Screen 
            name ="(adminTabs)"  
            options={{
              headerShown: false ,
              
              }}
          />

          <Stack.Screen name="+not-found" />

          <Stack.Screen 
            name ="index" 
            options={{ headerShown: false }}
          />

          <Stack.Screen 
            name ="screens/login"  
            options={{
              headerShown: true ,
              headerTitle: "",
              }}
          />
        </Stack>
        
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthContextProvider>
  );
}
