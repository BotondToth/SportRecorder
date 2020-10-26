import React, { useEffect } from 'react';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import { Text, Button, BottomNavigationTab, BottomNavigation } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FriendsList } from './FriendsList';

export const HomePage = ({ navigation }: Props) => {

	const { Navigator, Screen } = createBottomTabNavigator();

	const logOut = () => {
		AsyncStorage.removeItem('access-token')
			.then(() => navigation.navigate('Login'));

	}

	useEffect(() => {
		navigation.setOptions({
			headerTitleStyle: styles.headerStyle,
			headerLeft: (props: any) => (
				<Button
					size='small'
					status='basic'
					onPress={logOut}
				>Logout</Button>
			),
		});
	});

	const Friends = ({ navigation }: Props) => {
		return (
			<FriendsList navigation={navigation} />
		)
	};

	const HomeScreen = () => {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text>Home!</Text>
			</View>
		);
	};

	const StatScreen = () => {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text>Statistics!</Text>
			</View>
		);
	};

	const BottomNav = ({ navigation, state }: any) => (
		<BottomNavigation
			selectedIndex={state.index}
			onSelect={index => {
				navigation.navigate(state.routeNames[index]);
			}}
		>
			<BottomNavigationTab title='Friends' />
			<BottomNavigationTab title='Track workout' />
			<BottomNavigationTab title='Statistics' />
		</BottomNavigation >

		//TODO: correct navigation animation
	);

	return (
		<>
			<View style={{ justifyContent: 'center', alignItems: 'center' }}>
				<Text>Hello!</Text>
			</View>
			<Navigator
				tabBar={(props: any) => <BottomNav {...props} />}
			>
				<Screen name='Friends' component={Friends} />
				<Screen name='TrackWorkout' component={HomeScreen} />
				<Screen name='Stats' component={StatScreen} />
			</Navigator >
		</>
	);
};

const styles = StyleSheet.create({
	headerStyle: {
		marginLeft: 5,
	},
});
