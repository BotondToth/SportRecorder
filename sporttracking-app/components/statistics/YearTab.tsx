import { Text, Button, Spinner } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { View, StyleSheet } from 'react-native';
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

  const getStatistics = (year: Date) => {
    setLoading(true);
    setChartIsReady(false);
    // TODO: Stats backend-ről betölteni az adatokat
    client.sendRequest('workouts')
      .then(() => {
        setData([
          ['Month', 'Number of activities'],
          ['Jan', 15],
          ['Feb', 16],
          ['Mar', 15],
          ['Apr', 16],
          ['May', 15],
          ['Jun', 16],
          ['Jul', 15],
          ['Aug', 16],
          ['Sep', 15],
          ['Okt', 16],
          ['Nov', 16],
          ['Dec', 16],
        ]);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
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
  }, [selectedYear]);

  const chartEvents = [
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
              options={{ vAxis: { minValue: 0 } }}
            />
          )}
      </View>
    </View>
  );
};
