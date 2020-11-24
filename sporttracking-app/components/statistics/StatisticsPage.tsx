import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationProp } from '@react-navigation/native';
import { DayTab } from './DayTab';
import { MonthTab } from './MonthTab';
import { YearTab } from './YearTab';

const styles = StyleSheet.create({
  header: {
    flex: 0.1,
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  title: { textAlign: 'center' },
  content: { flex: 1 },
  viewSwitchButtons: { flexDirection: 'row' },
  switchButton: { flex: 1 },
  viewArea: { flex: 1 },
});
const DAY: string = 'day';
const MONTH: string = 'month';
const YEAR: string = 'year';

export const StatisticsPage = (
  { navigation }: {navigation: NavigationProp<any, string, any, {}, {}>},
) => {
  const CURRENT_DATE = new Date();
  const { Navigator, Screen } = createBottomTabNavigator();
  const [activeView, setActiveView] = useState(DAY);
  const [currentDateDay, setCurrentDateDay] = useState(CURRENT_DATE);
  const [currentDateMonth, setCurrentDateMonth] = useState(CURRENT_DATE);

  const navigate = useCallback((where: string) => {
    navigation.navigate(where);
    setActiveView(where);
  }, [navigation]);

  const monthOnClick = useCallback(
    (date: Date) => {
      setCurrentDateDay(new Date(date));
      navigate(DAY);
    }, [navigate],
  );

  const yearOnClick = useCallback(
    (date: Date) => {
      setCurrentDateMonth(new Date(date));
      navigate(MONTH);
    }, [navigate],
  );

  const Day = useMemo(() => () => <DayTab date={currentDateDay} />,
    [currentDateDay]);
  const Month = useMemo(() => () => <MonthTab changeDate={monthOnClick} date={currentDateMonth} />,
    [monthOnClick, currentDateMonth]);
  const Year = useMemo(
    () => () => <YearTab changeDate={yearOnClick} />,
    [yearOnClick],
  );

  return (
    <>
      <View style={styles.header}>
        <Text category="h5" style={styles.title}>Read your statistics!</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.viewSwitchButtons}>
          <Button
            appearance="outline"
            disabled={activeView === DAY}
            style={styles.switchButton}
            onPress={() => navigate(DAY)}
          >
            Daily
          </Button>
          <Button
            appearance="outline"
            disabled={activeView === MONTH}
            style={styles.switchButton}
            onPress={() => navigate(MONTH)}
          >
            Monthly
          </Button>
          <Button
            appearance="outline"
            disabled={activeView === YEAR}
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
            <Screen name={DAY} component={Day} />
            <Screen name={MONTH} component={Month} />
            <Screen name={YEAR} component={Year} />
          </Navigator>
        </View>
      </View>
    </>
  );
};
