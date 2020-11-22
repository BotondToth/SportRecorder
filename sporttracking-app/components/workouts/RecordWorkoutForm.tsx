import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  Button,
  Card,
} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { Stopwatch } from 'react-native-stopwatch-timer';
import * as Location from 'expo-location';
import { CreateWorkoutForm } from './CreateWorkoutForm';

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  stopper: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  footerControl: { marginHorizontal: 2 },
  field: { marginBottom: 20 },
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
});

export const RecordWorkoutForm = (props: any) => {
  const [startTimer, setStartTimer] = useState<boolean>(true);
  const [renderWorkoutForm, setRenderWorkoutForm] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(0);
  const [locations, setLocations] = useState<any[]>([]);
  const locationInterval = useRef(null);
  const elapsedSecondsInterval = useRef(null);

  useEffect(() => {
    elapsedSecondsInterval.current = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => clearInterval(elapsedSecondsInterval.current);
  }, []);

  useEffect(() => {
    locationInterval.current = setInterval(async () => {
      // const { status } = await Location.requestPermissionsAsync();
      // if (status !== 'granted') {
      // console.log('Permission to access location was denied');
      // }
      const location = await Location.getCurrentPositionAsync({});
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setLocations((locations) => locations.concat(location));
    }, 2000);
    return () => clearInterval(locationInterval.current);
  }, []);

  const Header = (headerProps: any) => (
    <View {...headerProps}>
      <Text category="h6">SportTracking</Text>
      <Text category="s1">Recording workout</Text>
    </View>
  );

  const Footer = (footerProps: any) => (
    <View {...footerProps} style={[footerProps.style, styles.footerContainer]}>
      <Button
        style={styles.footerControl}
        size="small"
        status="danger"
        onPress={() => {
          clearInterval(locationInterval.current);
          clearInterval(elapsedSecondsInterval.current);
          setStartTimer(false);
          setRenderWorkoutForm(true);
        }}
      >
        Finish workout
      </Button>
    </View>
  );

  const CreateWorkoutFormHolder = (
    <CreateWorkoutForm
      data={{
        duration: seconds,
        locations,
      }}
      onFinish={props.onSave}
    />
  );

  if (renderWorkoutForm) {
    return CreateWorkoutFormHolder;
  }

  return (
    <Card
      disabled
      style={styles.card}
      header={Header}
      footer={Footer}
    >
      <View style={styles.stopper}>
        <Text>Workout being recorded....</Text>
        <Stopwatch
          laps={false}
          msecs={false}
          start={startTimer}
          reset={false}
        />
      </View>
    </Card>
  );
};
