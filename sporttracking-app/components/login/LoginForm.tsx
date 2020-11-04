import React, { useState, useContext } from 'react';
import { Text, Card, Button, Input } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
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
  field: { marginBottom: 20 },
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const { signIn } = useContext(AuthorizationContext);
  const client: Client = Client.getInstance();

  const saveData = async (token: string) => {
    try {
      await AsyncStorage.setItem('access-token', token);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const isLoginButtonDisabled = () => (
    password.length === 0 || email.length === 0 || !validateEmail(email)
  );

  const loginUser = async (userToLogin: object) => {
    try {
      const response = await client.sendRequest('login', userToLogin);
      await saveData(response.headers.authorization);
      setLoginFailed(false);
      signIn();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      setLoginFailed(true);
    }
  };

  const onSubmit = async () => {
    await loginUser({
      email, password,
    });
  };

  const Header = (props: any) => (
    <View {...props}>
      <Text category="h6">SportTracking</Text>
    </View>
  );

  const Footer = (props: any) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      <Button
        disabled={isLoginButtonDisabled()}
        style={styles.footerControl}
        size="small"
        status="basic"
        onPress={onSubmit}
      >
        Login
      </Button>
    </View>
  );

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const RegisterLinkFooter = ({ navigation }: Props) => (
    <View style={styles.registerLink}>
      <Text>You don't have an account yet? Click</Text>
      <Text
        status="primary"
        onPress={() => navigation.navigate('Register')}
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
          label="Email address"
          placeholder="Email address"
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
          Invalid email or password!
        </Text>
        )}
      </Card>
      <RegisterLinkFooter navigation={navigation} />
    </>
  );
};
