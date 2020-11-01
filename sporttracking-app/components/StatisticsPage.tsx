import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IndexPath, Select, SelectItem, Tab, TabBar, Text } from '@ui-kitten/components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

export const StatisticsPage = () => {
	const NUMBER_OF_YEARS = 30;
	const CURRENT_YEAR = new Date().getFullYear();
	const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
	const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(NUMBER_OF_YEARS));
	const range = (start: number, end: number) => Array.from({ length: (end - start) }, (v, k) => k + start);
	const yearRange = range(CURRENT_YEAR - NUMBER_OF_YEARS, CURRENT_YEAR + 1);

	const { Navigator, Screen } = createMaterialTopTabNavigator();

	const DayTab = () => {
		return <Text category='h5'>DayTab</Text>
	}

	const MonthTab = () => {
		return <Text category='h5'>MonthTab</Text>
	}

	const YearTab = () => {
		return <View style={styles.dataSelector}>
			<Select
				label='Select a Year'
				value={selectedYear}
				selectedIndex={selectedIndex}
				onSelect={(index) => {
					setSelectedYear(CURRENT_YEAR - NUMBER_OF_YEARS + (index as IndexPath).row);
					setSelectedIndex(index as IndexPath)
				}}

			>
				{yearRange.map((result) => {
					return <SelectItem key={result} title={result} />;
				})}
			</Select>
		</View>
	}
	const TopTab = ({ navigation, state }: any) => (
		<TabBar
			selectedIndex={state.index}
			onSelect={(index) => {
				if (index !== state.index)
					navigation.navigate(state.routeNames[index]);
			}}
		>
			<Tab title='Day' />
			<Tab title='Month' />
			<Tab title='Year' />
		</TabBar>
	);

	return (
		<View
			style={styles.background}
		>
			<View style={styles.header}>
				<Text category="h5" style={styles.title}>Read your statistics!</Text>

			</View>
			<View style={styles.content}>
				<Navigator tabBar={TopTab}>
					<Screen name='Day' component={DayTab} />
					<Screen name='Month' component={MonthTab} />
					<Screen name='Year' component={YearTab} />
				</Navigator>
			</View>
		</View>
	);
};

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
	title: {
		textAlign: 'center',
	},
	content: {
		flex: 1
	},
	dataSelector: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	}
});