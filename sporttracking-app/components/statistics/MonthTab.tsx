import { Button, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Axios from 'axios';
import { LoadingSpinner } from '../LoadingSpinner';
import { AXIO_CANCELLED, DataType, DAYS } from '../../types/statsConstants';
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
const monthToStr = (dateToMonth: Date) => dateToMonth.toLocaleString('default', { month: 'long' });

export const MonthTab = ({ date: inputDate, changeDate }: {date: Date, changeDate: any}) => {
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
    setSelectedMonthAsStr(monthToStr(selectedDate));
    const canceltoken = Axios.CancelToken.source();

    const getStatistics = async () => {
      setLoading(true);
      const from = new Date(selectedDate);
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setMonth(to.getMonth() + 1);
      const mode = 'monthly';
      try {
        const statistics = await client.sendRequest<Map<string, number>>(`statistics?from=${from.getTime()}&to=${to.getTime()}&mode=${mode}`,
          null, false, canceltoken.token);
        const days: DataType[] = [];
        const lastDay = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
        for (let i = 1; i <= lastDay; i += 1) {
          days.push({
            x: i.toString(), y: statistics.data[i] || 0,
          });
        }
        setData(days);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getStatistics();
    return () => canceltoken.cancel(AXIO_CANCELLED);
  }, [client, selectedDate]);

  const disableDecrement = () => loading
        || (selectedDate.getFullYear() === 2000 && selectedDate.getMonth() === 0);

  const disableIncrement = () => loading
      || (selectedDate.getFullYear() === CURRENT_DATE.getFullYear()
      && selectedDate.getMonth() === CURRENT_DATE.getMonth());

  const chartClicked = useCallback((day: number) => {
    const newDate = selectedDate;
    newDate.setDate(day + 1);
    changeDate(newDate);
  }, [changeDate, selectedDate]);

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
          {`${selectMonthAsStr}, ${selectedDate.getFullYear()}`}
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
          : <StatisticsChart data={data} xaxisLabel={DAYS} onClickHandler={chartClicked} />}
      </View>
    </View>
  );
};
