import { Button, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Axios from 'axios';
import { LoadingSpinner } from '../LoadingSpinner';
import {
  AXIO_CANCELLED, DataType, MONTHS, RadialBarDataType, StatisticsTabInput, TabTypes,
} from '../../types';
import { Client } from '../../api';
import { StatisticsChart } from './StatisticsChart';
import { parseStatisticsData, parseWorkoutsByType } from '../../utils';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
    overflow: 'scroll',
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

export const YearTab = ({ chartOnClick }: StatisticsTabInput) => {
  const CURRENT_YEAR = new Date().getFullYear();
  const MODE = TabTypes.YEAR;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState<DataType[]>([]);
  const [workoutsByType, setWorkoutsByType] = useState<RadialBarDataType[]>([]);
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
      try {
        const statistics = await client.sendRequest<Map<string, number>>(`statistics?from=${from.getTime()}&to=${to.getTime()}&mode=${MODE}`,
          null, false, canceltoken.token);
        const statsByType = await client.sendRequest<Map<string, number>>(`statisticsByType?from=${from.getTime()}&to=${to.getTime()}`,
          null, false, canceltoken.token);
        setData(parseStatisticsData(statistics.data, monthNames));
        setWorkoutsByType(parseWorkoutsByType(statsByType.data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getStatistics();
    return () => canceltoken.cancel(AXIO_CANCELLED);
  }, [MODE, client, monthNames, selectedDate]);

  const chartClicked = useCallback((month: number) => {
    chartOnClick(new Date(selectedDate.getFullYear(), month), MODE);
  }, [MODE, chartOnClick, selectedDate]);

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
          : (
            <StatisticsChart
              statsData={data}
              workoutsByType={workoutsByType}
              xaxisLabel={MONTHS}
              title={selectedDate.getFullYear().toString()}
              onClickHandler={chartClicked}
            />
          )}
      </View>
    </View>
  );
};
