import { Select, IndexPath, SelectItem, Text } from '@ui-kitten/components';
import { Props } from '@ui-kitten/components/devsupport/services/props/props.service';
import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  header: {
    flex: 0.1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  title: { textAlign: 'center' },
  content: { flex: 1 },
  dataSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export const YearTab = () => {
  const NUMBER_OF_YEARS = 30;
  const CURRENT_YEAR = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(NUMBER_OF_YEARS));
  const range = (start: number, end: number) => Array.from({ length: (end - start) }, (v, k) => k + start);
  const yearRange = range(CURRENT_YEAR - NUMBER_OF_YEARS, CURRENT_YEAR + 1);

  const getStatistics = (year: number) => {
    console.log('getStats', year);
  };

  useEffect(() => {
    getStatistics(selectedYear);
  }, [selectedYear]);

  return (
    <View style={styles.dataSelector}>
      <Select
        label="Select a Year"
        value={selectedYear}
        selectedIndex={selectedIndex}
        onSelect={(index) => {
          setSelectedYear(CURRENT_YEAR - NUMBER_OF_YEARS + (index as IndexPath).row);
          setSelectedIndex(index as IndexPath);
        }}
      >
        {yearRange.map((result, idx) => {
          console.log(result, idx);
          return <SelectItem key={result} title={result} />;
        })}
      </Select>
    </View>
  );
};
