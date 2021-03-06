import React, { useEffect, useContext, useState } from 'react';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import {
  Button,
  BottomNavigationTab,
  BottomNavigation,
  Icon,
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { BottomTabBarOptions, BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoadingSpinner } from '../LoadingSpinner';
import { StatisticsPage } from '../statistics/StatisticsPage';
import { FriendsList } from '../friends/FriendsList';
import { WorkoutList } from '../workouts/WorkoutList';
import { AuthorizationContext } from '../../AuthorizationContext';
import { Client } from '../../api';

const styles = StyleSheet.create({
  headerStyle: { marginLeft: 25 },
  logOutButton: { marginHorizontal: 10 },
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  bottomTabs: {
    borderColor: 'rgb(216, 216, 216)',
    borderTopWidth: 1,
  },
});

export const HomePage = ({ navigation }: Props) => {
  const { Navigator, Screen } = createBottomTabNavigator();
  const { signOut } = useContext(AuthorizationContext);
  const client: Client = Client.getInstance();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logOut = async () => {
      await AsyncStorage.removeItem('access-token');
      await AsyncStorage.removeItem('logged-in-user');
      client.deleteCurrentUser();
      signOut();
    };

    setLoading(true);

    const setNavigationHeader = (username: string) => {
      navigation.setOptions({
        headerRight: () => (
          <Button
            nativeID="logoutBtn"
            style={styles.logOutButton}
            size="small"
            onPress={async () => {
              await logOut();
            }}
          >
            Logout
          </Button>
        ),
        title: `Hello, ${username}`,
      });
      setLoading(false);
    };

    const setUserName = async () => {
      const user = await client.getCurrentUser();
      setNavigationHeader(user.username);
    };

    setUserName();
  }, [client, navigation, signOut]);

  const FriendsIcon = (props: any) => <Icon {...props} name="people-outline" />;

  const WorkoutsIcon = (props: any) => <Icon {...props} name="navigation-2-outline" />;

  const StatsIcon = (props: any) => <Icon {...props} name="options-2-outline" />;

  const BottomNav = ({ state, navigation: navi }: BottomTabBarProps<BottomTabBarOptions>) => (
    <BottomNavigation
      style={styles.bottomTabs}
      selectedIndex={state.index}
      onSelect={(index) => {
        if (index !== state.index) { navi.navigate(state.routeNames[index]); }
      }}
    >
      <BottomNavigationTab title="Friends" icon={FriendsIcon} />
      <BottomNavigationTab title="Workouts" icon={WorkoutsIcon} />
      <BottomNavigationTab title="Statistics" icon={StatsIcon} />
    </BottomNavigation>
  );

  return (
    <>
      { loading
        ? <LoadingSpinner />
        : (
          <Navigator tabBar={BottomNav}>
            <Screen name="Friends" component={FriendsList} />
            <Screen name="Workouts" component={WorkoutList} />
            <Screen name="Stats" component={StatisticsPage} />
          </Navigator>
        )}
    </>
  );
};
