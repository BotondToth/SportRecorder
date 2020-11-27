import { Button, Text } from '@ui-kitten/components';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LoadingSpinner } from '../LoadingSpinner';
import { Client } from '../../api';
import { AXIO_CANCELLED, DataType, DAYS } from '../../types/statsConstants';
import { StatisticsChart } from './StatisticsChart';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
    overflow: 'hidden',
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

export const DayTab = ({ date: inputDate }: {date: Date}) => {
  const CURRENT_DATE = new Date();
  const [selectedDate, setSelectedDate] = useState(inputDate);
  const [selectMonthAsStr, setSelectedMonthAsStr] = useState(monthToStr(inputDate));
  const [data, setData] = useState<DataType[]>([]);
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
      const mode = 'daily';
      try {
        const statistics = await client.sendRequest<Map<string, number>>(`statistics?from=${from.getTime()}&to=${to.getTime()}&mode=${mode}`,
          null, false, canceltoken.token);
        const hours: DataType[] = [];
        for (let i = 0; i < 24; i += 1) {
          hours.push({
            x: i.toString(), y: statistics.data[i] || 0,
          });
        }
        setData(hours);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    setSelectedMonthAsStr(monthToStr(selectedDate));
    getStatistics();
    return () => canceltoken.cancel(AXIO_CANCELLED);
  }, [client, selectedDate]);

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
          {`${selectMonthAsStr}, ${selectedDate.getFullYear()} - ${selectedDate.getDate()}`}
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
          : <StatisticsChart data={data} xaxisLabel={DAYS} />}
      </View>
    </View>
  );
};
