import AsyncStorage from '@react-native-community/async-storage';
import { COLORS, DataType, RadialBarDataType, WorkoutTypes } from '../types';

const haversine = require('haversine');

export const validateEmail = (emailToTest: string) => {
  const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  return expression.test(emailToTest.toLowerCase());
};

export const calculateDistance = (points): number => {
  let distance = 0;
  points.forEach((point, index) => {
    if (index !== 0) {
      const start = {
        latitude: points[index - 1].coords.latitude,
        longitude: points[index - 1].coords.longitude,
      };

      const end = {
        latitude: point.coords.latitude,
        longitude: point.coords.longitude,
      };
      distance += haversine(start, end, { unit: 'meter' }); // TODO change back to default km
    }
  });
  return distance;
};

export const getFormattedLocationPoints = (points) => {
  const formattedPoints = [];
  points.map((point) => formattedPoints.push({
    latitude: point.coords.latitude,
    longitude: point.coords.longitude,
  }));
  return formattedPoints;
};

export const canUserEditWorkout = async (email: string) => {
  const loggedInUser = await AsyncStorage.getItem('logged-in-user');
  return loggedInUser === email;
};

// Parsing data on the Statistics page
export const parseStatisticsData = (data: Map<string, number>, xTicks: number[] | string []) => {
  console.log('DATA: ', data);
  const parsedData: DataType[] = [];
  for (let i = 0; i < xTicks.length; i += 1) {
    console.log(xTicks[i].toString(), data[xTicks[i]]);
    parsedData.push({
      x: xTicks[i].toString(), y: data[xTicks[i]] || 0,
    });
  }
  return parsedData;
};

export const parseWorkoutsByType = (data: Map<string, number>) => {
  const parsedData: RadialBarDataType[] = [];
  Object.values(WorkoutTypes).forEach((value) => {
    parsedData.push({
      name: value,
      value: data[value] || 0,
      fill: COLORS[value],
    });
  });
  return parsedData;
};
