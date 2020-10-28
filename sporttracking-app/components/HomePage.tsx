import React, { useEffect, useState, useContext } from 'react';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import {
	Text,
	Button,
	BottomNavigationTab,
	BottomNavigation,
	Modal
} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FriendsList } from './FriendsList';
import { WorkoutList } from './workouts/WorkoutList';
import { CreateWorkoutForm } from './workouts/CreateWorkoutForm';
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
			headerRight: (props: any) => (
				<Button
					style={styles.logOutButton}
					size='small'
					status='basic'
					onPress={logOut}
				>Logout</Button>
			),
		});
	});

    const HomeScreen = () => {

        return (
            <>
                <WorkoutList />
            </>
        );
    };

	const StatScreen = () => {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Text>Statistics!</Text>
			</View>
		);
	};

	const BottomNav = ({ navigation, state }: any) => (
		<BottomNavigation
			selectedIndex={state.index}
			onSelect={(index) => {
				navigation.navigate(state.routeNames[index]);
			}}
		>
			<BottomNavigationTab title="Friends" />
			<BottomNavigationTab title="Track workout" />
			<BottomNavigationTab title="Statistics" />
		</BottomNavigation>

		//TODO: correct navigation animation
	);

	return (
		<>
			<Navigator tabBar={(props: any) => <BottomNav {...props} />}>
				<Screen name="Friends" component={Friends} />
				<Screen name="TrackWorkout" component={HomeScreen} />
				<Screen name="Stats" component={StatScreen} />
			</Navigator>
		</>
	);
};

const styles = StyleSheet.create({
    headerStyle: {
        marginLeft: 25
    },
    logoutButton: {
        marginLeft: 20
    },
    workoutTitle: {
        padding: 15,
        backgroundColor: 'white'
    },
    modal: {
        width: 500
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },

});
