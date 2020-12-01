import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationProp } from '@react-navigation/native';
import { TabTypes } from '../../types';
import { DayTab } from './DayTab';
import { MonthTab } from './MonthTab';
import { YearTab } from './YearTab';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  header: {
    flex: 0.1,
    justifyContent: 'space-around',
  },
  title: { textAlign: 'center' },
  content: { flex: 1 },
  exportButton: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewSwitchButtons: {
    flexDirection: 'row',
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  switchButton: { },
  viewArea: { flex: 1 },
});

export const StatisticsPage = (
  { navigation }: {navigation: NavigationProp<any, string, any, {}, {}>},
) => {
  const CURRENT_DATE = new Date();
  const { Navigator, Screen } = createBottomTabNavigator();
  const [activeView, setActiveView] = useState(TabTypes.MONTH);
  const [currentDateDay, setCurrentDateDay] = useState(CURRENT_DATE);
  const [currentDateMonth, setCurrentDateMonth] = useState(CURRENT_DATE);

  const navigate = useCallback((where: TabTypes) => {
    navigation.navigate(where);
    setActiveView(where);
  }, [navigation]);

  const chartOnClick = useCallback(
    (date: Date, fromTab: TabTypes) => {
      if (fromTab === TabTypes.MONTH) {
        setCurrentDateDay(new Date(date));
        navigate(TabTypes.DAY);
      } else if (fromTab === TabTypes.YEAR) {
        setCurrentDateMonth(new Date(date));
        navigate(TabTypes.MONTH);
      }
    }, [navigate],
  );

  const Day = useMemo(() => () => <DayTab date={currentDateDay} />,
    [currentDateDay]);
  const Month = useMemo(() => () => (
    <MonthTab
      chartOnClick={chartOnClick}
      date={currentDateMonth}
    />
  ),
  [chartOnClick, currentDateMonth]);
  const Year = useMemo(
    () => () => <YearTab chartOnClick={chartOnClick} />,
    [chartOnClick],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text category="h5" style={styles.title}>Read your statistics!</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.viewSwitchButtons}>
          <Button
            appearance="outline"
            disabled={activeView === TabTypes.DAY}
            style={styles.switchButton}
            onPress={() => navigate(TabTypes.DAY)}
          >
            Daily
          </Button>
          <Button
            appearance="outline"
            disabled={activeView === TabTypes.MONTH}
            style={styles.switchButton}
            onPress={() => navigate(TabTypes.MONTH)}
          >
            Monthly
          </Button>
          <Button
            appearance="outline"
            disabled={activeView === TabTypes.YEAR}
            style={styles.switchButton}
            onPress={() => navigate(TabTypes.YEAR)}
          >
            Yearly
          </Button>
        </View>
        <View style={styles.viewArea}>
          <Navigator
            initialRouteName={TabTypes.MONTH}
            screenOptions={{ tabBarVisible: false }}
          >
            <Screen name={TabTypes.DAY} component={Day} />
            <Screen name={TabTypes.MONTH} component={Month} />
            <Screen name={TabTypes.YEAR} component={Year} />
          </Navigator>
        </View>
      </View>
    </View>
  );
};
