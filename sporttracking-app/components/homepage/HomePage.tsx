import React, { useEffect, useContext } from 'react';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import {
  Button,
  BottomNavigationTab,
  BottomNavigation,
  Icon,
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatisticsPage } from '../statistics/StatisticsPage';
import { FriendsList } from '../friends/FriendsList';
import { WorkoutList } from '../workouts/WorkoutList';
import { AuthorizationContext } from '../../AuthorizationContext';

const styles = StyleSheet.create({
  headerStyle: { marginLeft: 25 },
  logOutButton: { marginHorizontal: 10 },
  workoutTitle: {
    padding: 15,
    backgroundColor: 'white',
  },
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
});

export const HomePage = ({ navigation }: Props) => {
  const { Navigator, Screen } = createBottomTabNavigator();
  const { signOut } = useContext(AuthorizationContext);

  const logOut = () => {
    AsyncStorage.removeItem('access-token')
      .then(() => signOut());
  };

  useEffect(() => {
    navigation.setOptions({ headerRight: () => (
      <Button
        style={styles.logOutButton}
        size="small"
        status="basic"
        onPress={() => logOut()}
      >
        Logout
      </Button>
    ) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const FriendsIcon = (props: any) => <Icon {...props} name="people-outline" />;

  const WorkoutsIcon = (props: any) => <Icon {...props} name="navigation-2-outline" />;

  const StatsIcon = (props: any) => <Icon {...props} name="options-2-outline" />;

  const BottomNav = ({ state, navigation: navi }: any) => (
    <BottomNavigation
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
      <Navigator tabBar={BottomNav}>
        <Screen name="Friends" component={FriendsList} />
        <Screen name="Workouts" component={WorkoutList} />
        <Screen name="Stats" component={StatisticsPage} />
      </Navigator>
    </>
  );
};
