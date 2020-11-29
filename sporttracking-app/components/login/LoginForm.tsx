import React, { useState, useContext } from 'react';
import {
  Text, Card, Button, Input, Spinner,
} from '@ui-kitten/components';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import { AuthorizationContext } from '../../AuthorizationContext';
import { Client } from '../../api';
import { validateEmail } from '../../utils';

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 0,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: { marginHorizontal: 2 },
  field: {
    marginBottom: 20,
    width: Dimensions.get('window').width * (Platform.OS === 'web' ? 0.25 : 0.75),
  },
  registerLink: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
  },
});

export const LoginForm = ({ navigation }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const { signIn } = useContext(AuthorizationContext);
  const client: Client = Client.getInstance();

  const saveData = async (token: string) => {
    try {
      await AsyncStorage.setItem('access-token', token);
      await AsyncStorage.setItem('logged-in-user', email);
    } catch (e) {
      console.error(e);
    }
  };

  const isLoginButtonDisabled = () => password.length === 0 || email.length === 0 || (email.includes('@') && !validateEmail(email));

  const loginUser = async (userToLogin: object) => {
    try {
      setIsLoading(true);
      const response = await client.sendRequest('login', userToLogin);
      await saveData(response.headers.authorization);
      setLoginFailed(false);
      signIn();
    } catch (e) {
      console.error(e);
      setLoginFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    let user: {};
    if (email.includes('@')) {
      user = {
        email, password,
      };
    } else {
      user = {
        username: email, password,
      };
    }
    await loginUser(user);
  };

  const Header = (props: any) => (
    <View {...props}>
      <Text category="h6">SportTracking</Text>
    </View>
  );

  const Footer = (props: any) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      {
        isLoading ? <Spinner size="small" />
          : (
            <Button
              disabled={isLoginButtonDisabled()}
              style={styles.footerControl}
              size="small"
              status="basic"
              onPress={onSubmit}
            >
              Login
            </Button>
          )
      }

    </View>
  );

  const RegisterLinkFooter = ({ navigation: navi }: Props) => (
    <View style={styles.registerLink}>
      <Text>You don't have an account yet? Click</Text>
      <Text
        status="primary"
        onPress={() => navi.navigate('Register')}
      >
        here
      </Text>
    </View>
  );

  return (
    <>
      <Card
        disabled
        style={styles.card}
        header={Header}
        footer={Footer}
      >
        <Input
          style={styles.field}
          value={email}
          label="Email or Username"
          placeholder="Email or Username"
          secureTextEntry={false}
          onChangeText={(val: any) => setEmail(val)}
        />
        <Input
          style={styles.field}
          value={password}
          label="Password"
          placeholder="Password"
          secureTextEntry
          onChangeText={(val: any) => setPassword(val)}
        />
        {loginFailed && (
        <Text style={styles.errorMessage}>
          Invalid login data!
        </Text>
        )}
      </Card>
      <RegisterLinkFooter navigation={navigation} />
    </>
  );
};
