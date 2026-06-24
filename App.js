import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { GameProvider } from './src/context/GameContext';

import MapScreen from './src/screens/MapScreen';
import CourseScreen from './src/screens/CourseScreen';
import HoleDetailScreen from './src/screens/HoleDetailScreen';
import ScorecardScreen from './src/screens/ScorecardScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const MapStack = createNativeStackNavigator();
const HolesStack = createNativeStackNavigator();

function MapStackNavigator() {
  const { colors, t } = useSettings();
  return (
    <MapStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <MapStack.Screen name="MapScreen" component={MapScreen} options={{ title: t.map.title }} />
      <MapStack.Screen name="HoleDetail" component={HoleDetailScreen} options={{ title: '' }} />
    </MapStack.Navigator>
  );
}

function HolesStackNavigator() {
  const { colors, t } = useSettings();
  return (
    <HolesStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <HolesStack.Screen name="CourseScreen" component={CourseScreen} options={{ title: t.course.title }} />
      <HolesStack.Screen name="HoleDetail" component={HoleDetailScreen} options={{ title: '' }} />
    </HolesStack.Navigator>
  );
}

function AppTabs() {
  const { colors, t } = useSettings();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Kaart: '🗺️',
            Holes: '⛳',
            Scorekaart: '📋',
            Instellingen: '⚙️',
          };
          return <Text style={{ fontSize: size - 4 }}>{icons[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Kaart" component={MapStackNavigator} options={{ title: t.tabs.map }} />
      <Tab.Screen name="Holes" component={HolesStackNavigator} options={{ title: t.tabs.holes }} />
      <Tab.Screen
        name="Scorekaart"
        component={ScorecardScreen}
        options={{
          title: t.tabs.scorecard,
          headerShown: true,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Tab.Screen
        name="Instellingen"
        component={SettingsScreen}
        options={{
          title: t.tabs.settings,
          headerShown: true,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
    </Tab.Navigator>
  );
}

function NavWrapper() {
  const { colors, theme } = useSettings();
  return (
    <NavigationContainer>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <AppTabs />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <GameProvider>
          <NavWrapper />
        </GameProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
