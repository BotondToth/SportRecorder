import { Button, Spinner, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { ReactGoogleChartEvent } from 'react-google-charts/dist/types';
import { StyleSheet, View } from 'react-native';
import { Client } from '../../api';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  dataSelector: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  chart: { flex: 1 },
});

export const MonthTab = () => {
  const monthToStr = (date: Date) => date.toLocaleString('default', { month: 'long' });

  const CURRENT_DATE = new Date();
  const [selectedYear, setSelectedYear] = useState(CURRENT_DATE.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_DATE.getMonth());
  const [selectMonthAsStr, setSelectedMonthAsStr] = useState(monthToStr(CURRENT_DATE));
  const [data, setData] = useState<(string | number)[][]>([]);
  const [loading, setLoading] = useState(true);
  const [chartIsReady, setChartIsReady] = useState(false);
  const client: Client = Client.getInstance();

  const getStatistics = async (date: Date) => {
    setLoading(true);
    setChartIsReady(false);
    const from = new Date(date.getFullYear(), date.getMonth());
    const to = new Date(date.getFullYear(), date.getMonth() + 1);
    const mode = 'monthly';
    const statistics = await client.sendRequest<Map<String, Number>>(`statistics?from=${from.getTime()}&to=${to.getTime()}&mode=${mode}`);
    try {
      if (Object.keys(statistics.data).length !== 0) {
        const days: (string | number)[][] = [['Day', 'Number of activities']];
        const lastDay = new Date(selectedYear, date.getMonth(), 0).getDate();
        for (let i = 1; i <= lastDay; i += 1) {
          days.push([i, statistics.data[i]]);
        }
        setData(days);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const LoadingSpin = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <Spinner size="giant" />
    </View>
  );

  useEffect(() => {
    if (selectedMonth === 12) {
      setSelectedYear((value) => value + 1);
      setSelectedMonth(0);
    } else if (selectedMonth === -1) {
      setSelectedYear((value) => value - 1);
      setSelectedMonth(11);
    } else {
      const date = new Date(selectedYear, selectedMonth);
      setSelectedMonthAsStr(monthToStr(date));
      getStatistics(date);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  const disableDecrement = () => loading
        || !chartIsReady
        || (selectedYear === 2000 && selectedMonth === 0);

  const disableIncrement = () => loading
      || !chartIsReady
      || (selectedYear === CURRENT_DATE.getFullYear() && selectedMonth === CURRENT_DATE.getMonth());

  const chartEvents: ReactGoogleChartEvent[] = [
    {
      callback: () => {
        setChartIsReady(true);
      },
      eventName: 'ready',
    },
  ];

  return data.length > 0 ? (
    <View style={styles.content}>
      <View style={styles.dataSelector}>
        <Button
          disabled={disableDecrement()}
          onPress={() => setSelectedMonth((prevYear) => prevYear - 1)}
        >
          {'<'}
        </Button>
        <Text>
          {`${selectMonthAsStr}, ${selectedYear}`}
        </Text>
        <Button
          disabled={disableIncrement()}
          onPress={() => setSelectedMonth((prevYear) => prevYear + 1)}
        >
          {'>'}
        </Button>
      </View>
      <View style={styles.chart}>
        {loading
          ? <LoadingSpin />
          : (
            <Chart
              chartType="ColumnChart"
              loader={(<LoadingSpin />)}
              data={data}
              chartEvents={chartEvents}
              options={{ vAxis: { minValue: 0 } }}
            />
          )}
      </View>
    </View>
  ) : <Text>There are no statistics for this month.</Text>;
};
