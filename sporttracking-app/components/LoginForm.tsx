import React, { useState, useContext } from 'react';
import { Text, Card, Button, Input } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import axios from 'axios';
import { AuthorizationContext } from '../AuthorizationContext';

const RegisterLinkFooter = ({ navigation }: Props) => {
	return (
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
};

export const LoginForm = ({ navigation }: Props) => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loginFailed, setLoginFailed] = useState(false);
	const { signIn } = useContext(AuthorizationContext);

	const saveData = async (token: string) => {
		try {
			await AsyncStorage.setItem('access-token', token)
		} catch (e) {
			console.log(e);
		}
	}

	const isLoginButtonDisabled = () => {
		return (
			password.length === 0 || email.length === 0 || !validateEmail(email)
		);
	};

	const validateEmail = (email: string) => {
		const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

		return expression.test(String(email).toLowerCase());
	};

	const loginUser = async (userToLogin: object) => {

		axios
			.post('http://localhost:8080/login', userToLogin)
			.then((res) => {
				saveData(res.headers.authorization);
				setLoginFailed(false);
				signIn();
			})
			.catch((err) => {
				console.log(err);
				setLoginFailed(true);
			});
	};

	const onSubmit = async () => {
		await loginUser({ email, password });
	}

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
			>Login</Button>
		</View>
	);

	return (
		<>
			<Card
				disabled={true}
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
					secureTextEntry={true}
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
	footerControl: {
		marginHorizontal: 2,
	},
	field: {
		marginBottom: 20,
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
