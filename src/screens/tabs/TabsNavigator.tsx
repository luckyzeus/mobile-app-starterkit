import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LaunchStack from '../launch/LaunchStack';
import PlaceholderScreen from '../placeholder/PlaceholderScreen';
import { Fonts } from '../../theme/typography';

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ef1f65',
        tabBarInactiveTintColor: '#bbb',
        tabBarStyle: {
          backgroundColor: '#141414',
          borderTopColor: '#222',
          height: 64,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.BarlowCondensed700Italic,
          fontSize: 13,
        },
      }}
    >
      <Tab.Screen name="LaunchTab" component={LaunchStack} options={{ tabBarLabel: 'Launch' }} />
      <Tab.Screen name="GatewayTab" component={PlaceholderScreen} options={{ tabBarLabel: 'Gateway' }} />
      <Tab.Screen name="NexusTab" component={PlaceholderScreen} options={{ tabBarLabel: 'Nexus' }} />
      <Tab.Screen name="NetworkTab" component={PlaceholderScreen} options={{ tabBarLabel: 'Network' }} />
      <Tab.Screen name="HQTab" component={PlaceholderScreen} options={{ tabBarLabel: 'HQ' }} />
    </Tab.Navigator>
  );
}
