import { Button, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Axios from 'axios';
import { LoadingSpinner } from '../LoadingSpinner';
import { AXIO_CANCELLED, DataType, MONTHS } from '../../types/statsConstants';
import { Client } from '../../api';
import { StatisticsChart } from './StatisticsChart';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  dataSelector: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: '15px',
  },
  chart: {
    flex: 1,
    alignItems: 'center',
  },
});

export const YearTab = ({ changeDate }: any) => {
  const CURRENT_YEAR = new Date().getFullYear();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const client: Client = Client.getInstance();
  const monthNames = useMemo(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], []);

  useEffect(() => {
    const canceltoken = Axios.CancelToken.source();

    const getStatistics = async () => {
      setLoading(true);
      const from = new Date(selectedDate);
      from.setMonth(0, 1);
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setFullYear(to.getFullYear() + 1);
      const mode = 'yearly';
      try {
        const statistics = await client.sendRequest<Map<string, number>>(`statistics?from=${from.getTime()}&to=${to.getTime()}&mode=${mode}`,
          null, false, canceltoken.token);
        const months: DataType[] = [];
        monthNames.forEach((month) => {
          months.push({
            x: month, y: statistics.data[month] || 0,
          });
        });
        setData(months);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getStatistics();

    return () => canceltoken.cancel(AXIO_CANCELLED);
  }, [client, monthNames, selectedDate]);

  const chartClicked = useCallback((month: number) => {
    changeDate(new Date(selectedDate.getFullYear(), month));
  }, [changeDate, selectedDate]);

  return (
    <View style={styles.content}>
      <View style={styles.dataSelector}>
        <Button
          disabled={loading || selectedDate.getFullYear() === 2000}
          onPress={() => setSelectedDate(
            (value) => new Date(value.getFullYear() - 1, 0, 1),
          )}
        >
          {'<'}
        </Button>
        <Text category="h6">
          {selectedDate.getFullYear()}
        </Text>
        <Button
          disabled={loading || CURRENT_YEAR === selectedDate.getFullYear()}
          onPress={() => setSelectedDate(
            (value) => new Date(value.getFullYear() + 1, 0, 1),
          )}
        >
          {'>'}
        </Button>
      </View>
      <View style={styles.chart}>
        {loading
          ? <LoadingSpinner />
          : <StatisticsChart data={data} xaxisLabel={MONTHS} onClickHandler={chartClicked} />}
      </View>
    </View>
  );
};
