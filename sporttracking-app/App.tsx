import React, { useEffect, useState } from 'react';
import { ApplicationProvider, IconRegistry, Spinner } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { View } from 'react-native';
import { AuthorizationContext } from './AuthorizationContext';
import { RegisterForm, LoginForm, HomePage } from './components';

const Stack = createStackNavigator();

export default function App () {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('access-token')
      .then((value) => {
        if (value) {
          setLoggedIn(true);
        }
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const authContext = {
    signIn: () => {
      setLoggedIn(true);
    },
    signOut: () => {
      setLoggedIn(false);
    },
  };

  if (loading) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Spinner size="giant" />
        </View>
      </ApplicationProvider>
    );
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <AuthorizationContext.Provider value={authContext}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{ headerTitleAlign: 'center' }}
            >
              {loggedIn
                ? (<Stack.Screen name="Home" children={HomePage} />)
                : (
                  <>
                    <Stack.Screen name="Login" component={LoginForm} />
                    <Stack.Screen name="Register" component={RegisterForm} />
                  </>
                )}
            </Stack.Navigator>
          </NavigationContainer>
        </ApplicationProvider>
      </AuthorizationContext.Provider>
    </>
  );
}
