import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Spinner, Text } from '@ui-kitten/components';
import { YearTab } from './YearTab';

const styles = StyleSheet.create({
  header: {
    flex: 0.2,
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  title: { textAlign: 'center' },
  content: { flex: 1 },
  dataSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  viewSwitchButtons: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export const StatisticsPage = () => {
  const DAY = 0;
  const MONTH = 1;
  const YEAR = 2;
  const [activeView, setActiveView] = useState(YEAR);
  const DayTab = () => <Text category="h5">DayTab</Text>;
  const MonthTab = () => <Text category="h5">MonthTab</Text>;

  useEffect(() => {
    console.log('reload');
  }, []);

  return (
    <>
      <View style={styles.header}>
        <Text category="h5" style={styles.title}>Read your statistics!</Text>
      </View>
      <View style={styles.viewSwitchButtons}>
        <Button onPress={() => {
          setActiveView(MONTH);
          console.log(activeView);
        }}
        >
          Hónap
        </Button>
        <Button onPress={() => setActiveView(YEAR)}>Év</Button>
        <Button onPress={() => setActiveView(DAY)}>Nap</Button>
      </View>
      <View style={styles.content}>
        {activeView === DAY && (<DayTab />)}
        {activeView === MONTH && (<MonthTab />)}
        {activeView === YEAR && (<YearTab />)}
      </View>
    </>
  );
};
