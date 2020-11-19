import React, { useEffect, useState } from 'react';
import {
  Text,
  Button,
  Card,
  Input,
  Select,
  SelectItem,
  IndexPath,
} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { Stopwatch } from 'react-native-stopwatch-timer';
import _ from 'lodash';
import { Client } from '../../api';
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
  const distance: number = 5; // todo

  useEffect(() => {
    const interval = setInterval(() => {
      if (!renderWorkoutForm) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        setSeconds((seconds) => seconds + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
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
        duration: seconds, distance,
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
