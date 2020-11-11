import React, { useState } from 'react';
import {
  Text, Card, Button, Input, Modal, RadioGroup, Radio,
} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import _ from 'lodash';
import { Client } from '../../api';
import { validateEmail } from '../../utils';

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: { marginHorizontal: 2 },
  field: { marginBottom: 20 },
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  emailTakenModal: {
    width: '250px',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const RegisterForm = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [sex, setSex] = useState<number>();
  const [emailTakenModalVisible, setEmailTakenModalVisible] = useState(false);
  const [passwordIsDirty, setPasswordIsDirty] = useState(false);
  const [repeatedPasswordIsDirty, setRepeatedPasswordIsDirty] = useState(false);
  const [fullNameIsDirty, setFullNameIsDirty] = useState(false);
  const [emailIsDirty, setEmailIsDirty] = useState(false);
  const minPassLength = 6;
  const client: Client = Client.getInstance();

  const registerUser = async (userToRegister: object) => {
    try {
      await client.sendRequest('register', userToRegister);
      navigation.navigate('Login');
    } catch (e) {
      setEmailTakenModalVisible(true);
    }
  };

  const onSubmit = async () => {
    await registerUser({
      email, password, fullName, sex: sex === 0 ? 'm' : 'f', weight, height,
    });
  };

  const validateFullName = (): boolean => !!fullName && fullName.length > 0;

  const validateWeight = (): boolean => Number.isInteger(weight);

  const validateHeight = (): boolean => Number.isInteger(height);

  const validateSex = (): boolean => sex === 0 || sex === 1;

  const validatePassword = (): boolean => !!password && password.length >= minPassLength;

  const validateRepeatedPassword = (): boolean => password === repeatedPassword;

  const isRegisterButtonDisabled = (): boolean => (
    !validateEmail(email) || !validateFullName() || !validateSex()
    || !validateHeight() || !validateWeight() || !validatePassword() || !validateRepeatedPassword()
  );

  const Header = (props: any) => (
    <View {...props}>
      <Text category="h6">SportTracking</Text>
      <Text category="s1">Registration</Text>
    </View>
  );

  const Footer = (props: any) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      <Button
        disabled={isRegisterButtonDisabled()}
        style={styles.footerControl}
        size="small"
        status="basic"
        onPress={onSubmit}
      >
        Register
      </Button>
    </View>
  );

  return (
    <>
      {emailTakenModalVisible && (
      <Modal
        style={styles.emailTakenModal}
        visible={emailTakenModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setEmailTakenModalVisible(false)}
      >
        <Card disabled>
          <Text style={styles.center}>
            The email address you entered is already taken,
            please try another one.
          </Text>
          <Button
            size="small"
            onPress={() => setEmailTakenModalVisible(false)}
          >
            Close
          </Button>
        </Card>
      </Modal>
      )}
      <Card
        disabled
        style={styles.center}
        header={Header}
        footer={Footer}
      >
        <Input
          style={styles.field}
          value={email}
          status={!emailIsDirty || validateEmail(email) ? 'basic' : 'danger'}
          label="Email address"
          placeholder="Email address"
          caption={!emailIsDirty || validateEmail(email) ? '' : 'Should contain a valid email address!'}
          onChangeText={(nextValue) => setEmail(nextValue)}
          onBlur={() => setEmailIsDirty(true)}
        />
        <Input
          style={styles.field}
          value={fullName}
          status={!fullNameIsDirty || validateFullName() ? 'basic' : 'danger'}
          caption={!fullNameIsDirty || validateFullName() ? '' : 'Full name is required!'}
          label="Full name"
          placeholder="Full Name"
          onChangeText={(nextValue) => setFullName(nextValue)}
          onBlur={() => setFullNameIsDirty(true)}
        />
        <Input
          style={styles.field}
          value={weight.toString()}
          status={validateWeight() ? 'basic' : 'danger'}
          caption={validateWeight() ? '' : 'Should contain only numbers!'}
          label="Weight (kg)"
          onChangeText={(nextValue) => {
            if (nextValue === '') nextValue = String(0);
            if (!_.isNaN(Number(nextValue))) setWeight(Number.parseInt(nextValue, 10));
          }}
        />
        <Input
          style={styles.field}
          value={height.toString()}
          status={validateHeight() ? 'basic' : 'danger'}
          caption={validateHeight() ? '' : 'Should contain only numbers!'}
          label="Height (cm)"
          onChangeText={(nextValue) => {
            if (nextValue === '') nextValue = String(0);
            if (!_.isNaN(Number(nextValue))) setHeight(Number.parseInt(nextValue, 10));
          }}
        />
        <RadioGroup
          selectedIndex={sex}
          onChange={(nextValue) => setSex(nextValue)}
        >
          <Radio>Male</Radio>
          <Radio>Female</Radio>
        </RadioGroup>
        <Input
          style={styles.field}
          value={password}
          status={!passwordIsDirty || validatePassword() ? 'basic' : 'danger'}
          label="Password"
          placeholder="Password"
          caption={`Should contain at least ${minPassLength} symbols!`}
          secureTextEntry
          onChangeText={(nextValue) => setPassword(nextValue)}
          onBlur={() => setPasswordIsDirty(true)}
        />
        <Input
          style={styles.field}
          value={repeatedPassword}
          status={!repeatedPasswordIsDirty || validateRepeatedPassword()
            ? 'basic'
            : 'danger'}
          label="Repeat password"
          placeholder="Repeat password"
          caption={!repeatedPasswordIsDirty || validateRepeatedPassword()
            ? ''
            : 'Should match the password!'}
          secureTextEntry
          onChangeText={(nextValue) => setRepeatedPassword(nextValue)}
          onBlur={() => setRepeatedPasswordIsDirty(true)}
        />
      </Card>
    </>
  );
};
