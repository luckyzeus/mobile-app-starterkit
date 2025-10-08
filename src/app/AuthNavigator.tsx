import React, { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import LandingScreen from '../screens/auth/LandingScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SelectUsernameScreen from '../screens/onboarding/SelectUsernameScreen';
import SignUpScreen from '../screens/onboarding/SignUpScreen';
import { useAssetsStore } from '../state/client/assetsStore';

type AuthStackParamList = {
  Landing: undefined;
  SignIn: undefined;
  Username: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const HeaderLogo = memo(({ source }: { source: any }) => (
  <Image
    style={{ width: 55, height: 55, bottom: 5 }}
    source={source}
    resizeMode="contain"
  />
));

export default function AuthNavigator() {
  const logoBlack = useAssetsStore((s) => s.cachedAssets.logoBlack);
  const logoWhite = useAssetsStore((s) => s.cachedAssets.logoWhite);

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#f6f4f6' },
        headerTintColor: '#232327',
        headerTitle: () => {
          const source = route.name === 'SignUp' ? logoWhite : logoBlack;
          return source ? <HeaderLogo source={source} /> : null;
        },
      })}
    >
      <Stack.Screen name="Landing" options={{ headerShown: false }} component={LandingScreen} />
      <Stack.Screen name="SignIn" options={{ headerShown: false }} component={SignInScreen} />
      <Stack.Screen name="Username" component={SelectUsernameScreen} />
      {/* Showcase of some header screen specific overrides of header options */}
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerBackVisible: false,
          // headerBackTitle: 'Back',
          // // headerBlurEffect: 'extraLight',
          // // headerBackTitleStyle: {
          // //   fontSize: 28,
          // // },
          // headerTintColor: '#ef1f65',
          headerTransparent: true,
          animation: 'fade',
          headerStyle: {
            backgroundColor: 'transparent', // Ensures header has no background
          },
        }}
      />
    </Stack.Navigator>
  );
}
