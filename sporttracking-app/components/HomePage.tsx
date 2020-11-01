import React, { useEffect, useContext } from 'react';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import {
	Text,
	Button,
	BottomNavigationTab,
	BottomNavigation,
	Icon,
} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FriendsList } from './friends/FriendsList';
import { WorkoutList } from './workouts/WorkoutList';
import { AuthorizationContext } from '../AuthorizationContext';

export const HomePage = ({ navigation }: Props) => {

	const { Navigator, Screen } = createBottomTabNavigator();
	const { signOut } = useContext(AuthorizationContext);

	const logOut = () => {
		AsyncStorage.removeItem('access-token')
			.then(() => signOut());
	};

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Button
					style={styles.logOutButton}
					size='small'
					status='basic'
					onPress={logOut}
				>
					Logout
				</Button>
			),
		});
	}, []);

	const StatScreen = () => {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Text>Statistics!</Text>
			</View>
		);
	};

	const FriendsIcon = (props: any) => {
		return <Icon {...props} name='people-outline' />
	}

	const WorkoutsIcon = (props: any) => {
		return <Icon {...props} name='navigation-2-outline' />
	}

	const StatsIcon = (props: any) => {
		return <Icon {...props} name='options-2-outline' />
	}

	const BottomNav = ({ state, navigation }: any) => (
		<BottomNavigation
			selectedIndex={state.index}
			onSelect={(index) => {
				if (index !== state.index)
					navigation.navigate(state.routeNames[index]);
			}}
		>
			<BottomNavigationTab title='Friends' icon={FriendsIcon} />
			<BottomNavigationTab title='Workouts' icon={WorkoutsIcon} />
			<BottomNavigationTab title='Statistics' icon={StatsIcon} />
		</BottomNavigation>
	);

	return (
		<Navigator tabBar={BottomNav}>
			<Screen name='Friends' component={FriendsList} />
			<Screen name='Workouts' component={WorkoutList} />
			<Screen name='Stats' component={StatScreen} />
		</Navigator>
	);
};

const styles = StyleSheet.create({
	headerStyle: {
		marginLeft: 25,
	},
	logOutButton: {
		marginHorizontal: 10,
	},
	workoutTitle: {
		padding: 15,
		backgroundColor: 'white',
	},
	backdrop: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},

});
