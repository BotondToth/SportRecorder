import React, { useEffect, useState } from 'react';
import { RegisterForm } from './components/RegisterForm';
import { ApplicationProvider, IconRegistry, Spinner } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginForm } from './components/LoginForm';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import { HomePage } from './components/HomePage';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthorizationContext } from './AuthorizationContext';
import { View } from 'react-native';

const Stack = createStackNavigator();

const Register = ({ navigation }: Props) => {
	return <RegisterForm navigation={navigation} />;
};

const Login = ({ navigation }: Props) => {
	return <LoginForm navigation={navigation} />;
};

const Home = ({ navigation }: Props) => {
	return <HomePage navigation={navigation} />;
};

export default function App() {
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
			.catch(console.log);
	}, []);

	const authContext = {
		signIn: () => {
			setLoggedIn(true);
		},
		signOut: () => {
			setLoggedIn(false);
		},
	};

	if (loading)
		return (
			<ApplicationProvider {...eva} theme={eva.light}>
				<View style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center'
				}}>
					<Spinner size='giant' />
				</View>
			</ApplicationProvider>
		);

	return (
		<>
			<IconRegistry icons={EvaIconsPack} />
			<AuthorizationContext.Provider value={authContext}>
				<ApplicationProvider {...eva} theme={eva.light}>
					< NavigationContainer >
						<Stack.Navigator
							screenOptions={{ headerTitleAlign: 'center' }}
						>
							{loggedIn
								? (<Stack.Screen name="Home" children={Home} />)
								: (
									<>
										<Stack.Screen name="Login" component={Login} />
										<Stack.Screen name="Register" component={Register} />
									</>
								)}
						</Stack.Navigator>
					</NavigationContainer>
				</ApplicationProvider >
			</AuthorizationContext.Provider>
		</>
	);
}
