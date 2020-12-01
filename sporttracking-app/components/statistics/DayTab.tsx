import { Button, Text } from '@ui-kitten/components';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LoadingSpinner } from '../LoadingSpinner';
import { Client } from '../../api';
import {
  AXIO_CANCELLED, DataType, HOURS,
  RadialBarDataType, StatisticsTabInput, TabTypes,
} from '../../types/statsConstants';
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
const monthToStr = (dateToMonth: Date) => dateToMonth.toLocaleString('default', { month: 'long' });
const formatTitle = (dateToConvert: Date) => `${monthToStr(dateToConvert)}, ${dateToConvert.getFullYear()} - ${dateToConvert.getDate()}`;

export const DayTab = ({ date: inputDate }: StatisticsTabInput) => {
  const CURRENT_DATE = new Date();
  const MODE = TabTypes.DAY;
  const [selectedDate, setSelectedDate] = useState(inputDate);
  const [title, setTitle] = useState(formatTitle(inputDate));
  const [data, setData] = useState<DataType[]>([]);
  const [workoutsByType, setWorkoutsByType] = useState<RadialBarDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const client: Client = Client.getInstance();

  useEffect(() => {
    setSelectedDate(inputDate);
  }, [inputDate]);

  useEffect(() => {
    const canceltoken = Axios.CancelToken.source();

    const getStatistics = async () => {
      setLoading(true);
      const from = new Date(selectedDate);
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setDate(to.getDate() + 1);
      try {
        const statistics = await client.sendRequest<Map<string, number>>(`statistics?from=${from.getTime()}&to=${to.getTime()}&mode=${MODE}`,
          null, false, canceltoken.token);
        const statsByType = await client.sendRequest<Map<string, number>>(`statisticsByType?from=${from.getTime()}&to=${to.getTime()}`,
          null, false, canceltoken.token);
        const xTicks = Array.from(Array(24).keys());
        setData(parseStatisticsData(statistics.data, xTicks));
        setWorkoutsByType(parseWorkoutsByType(statsByType.data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    setTitle(formatTitle(selectedDate));
    getStatistics();
    return () => canceltoken.cancel(AXIO_CANCELLED);
  }, [MODE, client, selectedDate]);

  const disableDecrement = () => loading
        || selectedDate <= new Date(2000, 0, 1);

  const disableIncrement = () => loading
        || new Date(selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate() + 1) >= CURRENT_DATE;

  return (
    <View style={styles.content}>
      <View style={styles.dataSelector}>
        <Button
          disabled={disableDecrement()}
          onPress={() => {
            setSelectedDate(
              (value) => new Date(value.getFullYear(), value.getMonth(), value.getDate() - 1),
            );
          }}
        >
          {'<'}
        </Button>
        <Text category="h6">
          {title}
        </Text>
        <Button
          disabled={disableIncrement()}
          onPress={() => {
            setSelectedDate(
              (value) => new Date(value.getFullYear(), value.getMonth(), value.getDate() + 1),
            );
          }}
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
              xaxisLabel={HOURS}
              title={title}
            />
          )}
      </View>
    </View>
  );
};
