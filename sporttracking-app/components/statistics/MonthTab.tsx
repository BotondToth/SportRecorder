import { Button, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Axios from 'axios';
import { LoadingSpinner } from '../LoadingSpinner';
import {
  AXIO_CANCELLED, DataType, DAYS,
  RadialBarDataType, StatisticsTabInput, TabTypes,
} from '../../types/statsConstants';
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
const monthToStr = (dateToMonth: Date) => dateToMonth.toLocaleString('default', { month: 'long' });
const formatTitle = (dateToConvert: Date) => `${monthToStr(dateToConvert)}, ${dateToConvert.getFullYear()}`;

export const MonthTab = ({ date: inputDate, chartOnClick }:StatisticsTabInput) => {
  const CURRENT_DATE = new Date();
  const MODE = TabTypes.MONTH;
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
    setTitle(formatTitle(selectedDate));
    const canceltoken = Axios.CancelToken.source();

    const getStatistics = async () => {
      setLoading(true);
      const from = new Date(selectedDate);
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setMonth(to.getMonth() + 1);
      try {
        const statistics = await client.sendRequest<Map<string, number>>(`statistics?from=${from.getTime()}&to=${to.getTime()}&mode=${MODE}`,
          null, false, canceltoken.token);
        const statsByType = await client.sendRequest<Map<string, number>>(`statisticsByType?from=${from.getTime()}&to=${to.getTime()}`,
          null, false, canceltoken.token);
        const lastDay = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
        const xTicks = Array.from({ length: lastDay }, (_, i) => i + 1);
        setData(parseStatisticsData(statistics.data, xTicks));
        setWorkoutsByType(parseWorkoutsByType(statsByType.data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getStatistics();
    return () => canceltoken.cancel(AXIO_CANCELLED);
  }, [MODE, client, selectedDate]);

  const disableDecrement = () => loading
        || (selectedDate.getFullYear() === 2000 && selectedDate.getMonth() === 0);

  const disableIncrement = () => loading
      || (selectedDate.getFullYear() === CURRENT_DATE.getFullYear()
          && selectedDate.getMonth() === CURRENT_DATE.getMonth());

  const chartClicked = useCallback((day: number) => {
    const newDate = selectedDate;
    newDate.setDate(day + 1);
    chartOnClick(newDate, MODE);
  }, [MODE, chartOnClick, selectedDate]);

  return (
    <View style={styles.content}>
      <View style={styles.dataSelector}>
        <Button
          disabled={disableDecrement()}
          onPress={() => setSelectedDate(
            (value) => new Date(value.getFullYear(), value.getMonth() - 1),
          )}
        >
          {'<'}
        </Button>
        <Text category="h6">
          {title}
        </Text>
        <Button
          disabled={disableIncrement()}
          onPress={() => {
            setSelectedDate((value) => new Date(value.getFullYear(), value.getMonth() + 1));
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
              xaxisLabel={DAYS}
              title={title}
              onClickHandler={chartClicked}
            />
          )}
      </View>
    </View>
  );
};
