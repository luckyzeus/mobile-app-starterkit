import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import LaunchHomeScreen from './LaunchHomeScreen';
import MessagesScreen from '../messages/MessagesScreen';
import MissionsScreen from './MissionsScreen';

export type LaunchStackParamList = {
  LaunchHome: undefined;
  Messages: undefined;
  Missions: undefined;
};

const Stack = createNativeStackNavigator<LaunchStackParamList>();

export default function LaunchStack() {
  return (
    <Stack.Navigator
      initialRouteName="LaunchHome"
      screenOptions={({ navigation }) => ({
        headerTitle: '',
        headerShadowVisible: false,
        headerTransparent: true,
        headerTintColor: '#fff',
        headerRight: () => (
          <TouchableOpacity
            style={{ paddingHorizontal: 12, paddingVertical: 6 }}
            onPress={() => navigation.navigate('Messages')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#ef1f65" />
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen name="LaunchHome" component={LaunchHomeScreen} />
      <Stack.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          headerTitle: 'Messages',
          headerTransparent: false,
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Missions"
        component={MissionsScreen}
        options={{
          headerTitle: 'Missions',
          headerTransparent: false,
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}
