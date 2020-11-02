import React, { useState } from 'react';
import { Text, Card, Button, Input, Modal, RadioGroup, Radio } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import axios from 'axios';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';

export const RegisterForm = ({ navigation }: Props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatedPassword, setRepeated] = useState('');
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

	const registerUser = (userToRegister: object): any => {
		// TODO: move requests into dedicated class, address should come from env file instead of fix localhost
		axios
			.post('http://localhost:8080/register', userToRegister)
			.then((res) => {
				navigation.navigate('Login');
			})
			.catch(() => {
				setEmailTakenModalVisible(true);
			});
	};

	const onSubmit = async () => {
		await registerUser({ email, password, fullName, sex: sex === 0 ? 'm' : 'f', weight, height });
	};

	const isRegisterButtonDisabled = (): boolean => {
		return (
			!validateEmail() || !validateFullName() || !validateSex() ||
			!validateHeight() || !validateWeight() || !validatePassword() || !validateRepeatedPassword()
		);
	};

	const validateEmail = (): boolean => {
		const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

		return expression.test(email.toLowerCase());
	};

	const validateFullName = (): boolean => {
		return !!fullName && fullName.length > 0;
	};

	const validateWeight = (): boolean => {
		return Number.isInteger(weight);
	};

	const validateHeight = (): boolean => {
		return Number.isInteger(height);
	};

	const validateSex = (): boolean => {
		return sex === 0 || sex === 1;
	};

	const validatePassword = (): boolean => {
		return !!password && password.length >= minPassLength;
	};

	const validateRepeatedPassword = (): boolean => {
		return password === repeatedPassword;
	};

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
					<Card disabled={true}>
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
				disabled={true}
				style={styles.center}
				header={Header}
				footer={Footer}
			>
				<Input
					style={styles.field}
					value={email}
					status={!emailIsDirty || validateEmail() ? 'basic' : 'danger'}
					label="Email address"
					placeholder="Email address"
					caption={!emailIsDirty || validateEmail() ? '' : 'Should contain a valid email address!'}
					onChangeText={(nextValue) => setEmail(nextValue)}
					onBlur={() => setEmailIsDirty(true)}
				/>
				<Input
					style={styles.field}
					value={fullName}
					status={!fullNameIsDirty || validateFullName() ? 'basic' : 'danger'}
					caption={!fullNameIsDirty || validateFullName() ? '' : 'Full name is required!'}
					label='Full name'
					placeholder='Full Name'
					onChangeText={(nextValue) => setFullName(nextValue)}
					onBlur={() => setFullNameIsDirty(true)}
				/>
				<Input
					style={styles.field}
					value={weight.toString()}
					status={validateWeight() ? 'basic' : 'danger'}
					caption={validateWeight() ? '' : 'Should contain only numbers!'}
					label='Weight (kg)'
					onChangeText={(nextValue) => {
						if (nextValue === '')
							nextValue = String(0);
						if (!isNaN(Number(nextValue)))
							setWeight(Number.parseInt(nextValue));
					}}
				/>
				<Input
					style={styles.field}
					value={height.toString()}
					status={validateHeight() ? 'basic' : 'danger'}
					caption={validateHeight() ? '' : 'Should contain only numbers!'}
					label='Height (cm)'
					onChangeText={(nextValue) => {
						if (nextValue === '')
							nextValue = String(0);
						if (!isNaN(Number(nextValue)))
							setHeight(Number.parseInt(nextValue));
					}}
				/>
				<RadioGroup
					selectedIndex={sex}
					onChange={(nextValue) => setSex(nextValue)}>
					<Radio>Male</Radio>
					<Radio>Female</Radio>
				</RadioGroup>
				<Input
					style={styles.field}
					value={password}
					status={!passwordIsDirty || validatePassword() ? 'basic' : 'danger'}
					label='Password'
					placeholder='Password'
					caption={'Should contain at least ' + minPassLength + ' symbols!'}
					secureTextEntry={true}
					onChangeText={(nextValue) => setPassword(nextValue)}
					onBlur={() => setPasswordIsDirty(true)}
				/>
				<Input
					style={styles.field}
					value={repeatedPassword}
					status={!repeatedPasswordIsDirty || validateRepeatedPassword()
						? 'basic'
						: 'danger'}
					label='Repeat password'
					placeholder='Repeat password'
					caption={!repeatedPasswordIsDirty || validateRepeatedPassword()
						? ''
						: 'Should match the password!'}
					secureTextEntry={true}
					onChangeText={(nextValue) => setRepeated(nextValue)}
					onBlur={() => setRepeatedPasswordIsDirty(true)}
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
	footerControl: {
		marginHorizontal: 2,
	},
	field: {
		marginBottom: 20,
	},
	backdrop: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	emailTakenModal: {
		width: '250px',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}
});
