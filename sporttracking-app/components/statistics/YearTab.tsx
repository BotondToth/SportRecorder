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

export const YearTab = () => {
  const CURRENT_YEAR = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [data, setData] = useState<(string | number)[][]>([]);
  const [loading, setLoading] = useState(true);
  const [chartIsReady, setChartIsReady] = useState(false);
  const client: Client = Client.getInstance();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getStatistics = async (date: Date) => {
    setLoading(true);
    setChartIsReady(false);
    const from = new Date(date.getFullYear(), 0);
    const to = new Date(date.getFullYear() + 1, 0);
    const mode = 'yearly';
    const statistics = await client.sendRequest<Map<string, number>>(`statistics?from=${from.getTime()}&to=${to.getTime()}&mode=${mode}`);
    try {
      const months: (string | number)[][] = [['Month', 'Number of activities']];
      monthNames.forEach((month) => months.push([month, statistics.data[month] || 0]));
      setData(months);
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
    getStatistics(new Date(selectedYear, 0, 1));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

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
          disabled={loading || !chartIsReady || selectedYear === 2000}
          onPress={() => setSelectedYear((prevYear) => prevYear - 1)}
        >
          {'<'}
        </Button>
        <Text>
          {selectedYear}
        </Text>
        <Button
          disabled={loading || !chartIsReady || CURRENT_YEAR === selectedYear}
          onPress={() => setSelectedYear((prevYear) => prevYear + 1)}
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
              options={{
                vAxis: { viewWindow: { min: 0 } },
                hAxis: {
                  format: '#', gridlines: { count: 12 },
                },
              }}
            />
          )}
      </View>
    </View>
  );
};
