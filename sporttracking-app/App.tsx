import React from 'react';
import { RegisterForm } from './components/RegisterForm';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginForm } from './components/LoginForm';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import { FriendsList } from './components/FriendsList';

const Stack = createStackNavigator();

const Register = ({ navigation }: Props) => {
  return (
      <RegisterForm navigation={navigation}/>
  );
};

const Login = ({ navigation }: Props) => {
  return (
      <LoginForm navigation={navigation}/>
  )
};

const Friends = ({ navigation }: Props) => {
  return (
      <FriendsList navigation={navigation}/>
  )
};

export default function App() {
  return (
      <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer>
              <Stack.Navigator>
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Register" component={Register} />
                  <Stack.Screen name="My Friends" component={Friends} />
              </Stack.Navigator>
          </NavigationContainer>
      </ApplicationProvider>
  );
}
