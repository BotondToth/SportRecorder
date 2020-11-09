import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { YearTab } from './YearTab';
import { MonthTab } from './MonthTab';
import { DayTab } from './DayTab';

const styles = StyleSheet.create({
  header: {
    flex: 0.1,
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  title: { textAlign: 'center' },
  content: { flex: 1 },
  viewSwitchButtons: {
    flex: 0.08,
    flexDirection: 'row',
  },
  switchButton: { flex: 1 },
  viewArea: { flex: 1 },
});

export const StatisticsPage = ({ navigation }: any) => {
  const { Navigator, Screen } = createBottomTabNavigator();
  const DAY: string = 'day';
  const MONTH: string = 'month';
  const YEAR: string = 'year';

  const navigate = (where: string) => {
    navigation.navigate(where);
  };

  return (
    <>
      <View style={styles.header}>
        <Text category="h5" style={styles.title}>Read your statistics!</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.viewSwitchButtons}>
          <Button
            appearance="outline"
            style={styles.switchButton}
            onPress={() => navigate(DAY)}
          >
            Daily
          </Button>
          <Button
            appearance="outline"
            style={styles.switchButton}
            onPress={() => navigate(MONTH)}
          >
            Monthly
          </Button>
          <Button
            appearance="outline"
            style={styles.switchButton}
            onPress={() => navigate(YEAR)}
          >
            Yearly
          </Button>
        </View>
        <View style={styles.viewArea}>
          <Navigator
            initialRouteName={DAY}
            screenOptions={{ tabBarVisible: false }}
          >
            <Screen name={DAY} component={DayTab} />
            <Screen name={MONTH} component={MonthTab} />
            <Screen name={YEAR} component={YearTab} />
          </Navigator>
        </View>
      </View>
    </>
  );
};
