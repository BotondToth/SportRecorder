import React, { useState} from 'react';
import {Text, Card, Button, Input, Modal} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import axios from 'axios';

export const registerUser = (userToRegister: object) => { // TODO: move requests into dedicated class, address should come from env file instead of fix localhost
    return axios.post('http://localhost:8080/register', userToRegister);
};

export const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [emailTakenModalVisible, setEmailTakenModalVisible] = useState(false);
    const repeatPasswordStatus = password !== repeatedPassword;

    const onSubmit = async () => {
      const registeredUser = await registerUser({email, password});
      if (registeredUser.status === 400) {
          setEmailTakenModalVisible(true);
      }
    }

    const isRegisterButtonDisabled = () => {
        return !validateEmail(email) || password.length < 5 || repeatPasswordStatus;
    }

    const validateEmail = (email: string) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

        return expression.test(String(email).toLowerCase())
    }

    const Header = (props: any) => (
        <View {...props}>
            <Text category='h6'>SportTracking</Text>
            <Text category='s1'>      Registration    </Text>
        </View>
    );

    const Footer = (props: any) => (
        <View {...props} style={[props.style, styles.footerContainer]}>
            <Button
                disabled={isRegisterButtonDisabled()}
                style={styles.footerControl}
                size='small'
                status='basic'
                onPress={onSubmit}>
                Register
            </Button>
        </View>
    );

    return (
        <>
            {
                emailTakenModalVisible && (<Modal
                    visible={emailTakenModalVisible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => setEmailTakenModalVisible(false)}>
                    <Card disabled={true}>
                        <Text>The email address you entered is already taken, please try an other one.</Text>
                        <Button onPress={() => setEmailTakenModalVisible(false)}>
                            Cancel
                        </Button>
                    </Card>
                </Modal>)
            }
            <Card style={styles.card} header={Header} footer={Footer}>
                <Input
                    style={styles.field}
                    value={email}
                    label='Email address'
                    placeholder='Email address'
                    caption='You should provide a valid email address'
                    secureTextEntry={false}
                    onChangeText={nextValue => setEmail(nextValue)}
                />
                <Input
                    style={styles.field}
                    value={password}
                    label='Password'
                    placeholder='Password'
                    caption='Should contain at least 6 symbols'
                    secureTextEntry={true}
                    onChangeText={nextValue => setPassword(nextValue)}
                />
                <Input
                    style={styles.field}
                    value={repeatedPassword}
                    status={repeatPasswordStatus ? 'danger' : 'basic'}
                    label='Repeat password'
                    placeholder='Repeat password'
                    caption='Should match password'
                    secureTextEntry={true}
                    onChangeText={nextValue => setRepeatedPassword(nextValue)}
                />
            </Card>
        </>
    );

};

const styles = StyleSheet.create({
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    footerControl: {
        marginHorizontal: 2,
    },
    field: {
        marginBottom: 20,
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
