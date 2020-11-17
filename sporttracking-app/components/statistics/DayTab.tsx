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

export const DayTab = () => {
  const monthToStr = (date: Date) => date.toLocaleString('default', { month: 'long' });

  const CURRENT_DATE = new Date();
  const [selectedYear, setSelectedYear] = useState(CURRENT_DATE.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_DATE.getMonth());
  const [selectedDay, setSelectedDay] = useState(CURRENT_DATE.getDate());
  const [selectMonthAsStr, setSelectedMonthAsStr] = useState(monthToStr(CURRENT_DATE));
  const [data, setData] = useState<(string | number)[][]>([]);
  const [loading, setLoading] = useState(true);
  const [chartIsReady, setChartIsReady] = useState(false);
  const client: Client = Client.getInstance();

  const getStatistics = async (date: Date) => {
    setLoading(true);
    setChartIsReady(false);
    const from = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const to = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const mode = 'daily';
    const statistics = await client.sendRequest<Map<string, number>>(`statistics?from=${from.getTime()}&to=${to.getTime()}&mode=${mode}`);
    try {
      const hours: (string | number)[][] = [['Hour', 'Number of activities']];
      for (let i = 0; i < 24; i += 1) {
        hours.push([i, statistics.data[i] || 0]);
      }
      setData(hours);
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
    const date = new Date(selectedYear, selectedMonth, selectedDay);
    const checkDay = date.getDay();
    if (selectedDay !== checkDay) {
      setSelectedYear(date.getFullYear());
      setSelectedMonth(date.getMonth());
      setSelectedMonthAsStr(monthToStr(date));
      setSelectedDay(date.getDate());
    }
    getStatistics(date);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay]);

  const disableDecrement = () => loading
        || !chartIsReady
        || new Date(selectedYear, selectedMonth, selectedYear) <= new Date(2000, 0, 1);

  const disableIncrement = () => loading
        || !chartIsReady
        || new Date(selectedYear, selectedMonth, selectedDay + 1) >= CURRENT_DATE;

  const chartEvents: ReactGoogleChartEvent[] = [
    {
      callback: () => {
        setChartIsReady(true);
      },
      eventName: 'ready',
    },
  ];

  return (
    <View style={styles.content}>
      <View style={styles.dataSelector}>
        <Button
          disabled={disableDecrement()}
          onPress={() => setSelectedDay((prevYear) => prevYear - 1)}
        >
          {'<'}
        </Button>
        <Text>
          {`${selectMonthAsStr}, ${selectedYear} - ${selectedDay}`}
        </Text>
        <Button
          disabled={disableIncrement()}
          onPress={() => setSelectedDay((prevYear) => prevYear + 1)}
        >
          {'>'}
        </Button>
      </View>
      <View style={styles.chart}>
        {loading
          ? <LoadingSpin />
          : (
            <Chart
              width="100%"
              height="400px"
              chartType="ColumnChart"
              loader={(<LoadingSpin />)}
              chartEvents={chartEvents}
              data={data}
              options={{
                vAxis: { viewWindow: { min: 0 } },
                hAxis: {
                  format: '#', gridlines: { count: 24 },
                },
              }}
            />
          )}
      </View>
    </View>
  );
};
