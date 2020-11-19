import React, { useState } from 'react';
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
import _ from 'lodash';
import { Client } from '../../api';

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
  footerControl: { marginHorizontal: 2 },
  field: { marginBottom: 20 },
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
});

export const RecordWorkoutForm = (props: any) => {
  const [title, setTitle] = useState('');
  let startTime: Date; let
    endTime: Date;
  const client: Client = Client.getInstance();

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
        // onPress={} TODO
      >
        Finish workout
      </Button>
    </View>
  );

  return (
    <Card
      disabled
      style={styles.card}
      header={Header}
      footer={Footer}
    >
      <Text>Workout being recorded....</Text>
    </Card>
  );
};
