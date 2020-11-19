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

const data = ['Running', 'Cycling', 'Walking', 'Swimming'];

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

const calculateDuration = (duration: number): number => {
  console.log('duration: ', duration);
  const times = duration.split(':');
  console.log('calculated minutes: ', parseInt(times[0], 10) * 60 + parseInt(times[1], 10) + parseInt(times[2], 10) / 60);
  return parseInt(times[0], 10) * 60 + parseInt(times[1], 10) + parseInt(times[2], 10) / 60;
};

export const CreateWorkoutForm = (props: any) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const type = data[selectedIndex.row];
  const [duration, setDuration] = useState<number>(props.data.duration
    ? Math.floor(props.data.duration / 60) : 0);
  const [distance, setDistance] = useState(props.data.distance ? props.data.distance : 0);
  const client: Client = Client.getInstance();
  const isFormEditable = _.isUndefined(props.data);

  const onSubmit = async () => {
    const workout = {
      title,
      description,
      type,
      duration,
      distance,
    };

    await client.sendRequest('workout', workout);
    props.onFinish();
  };

  const Header = (headerProps: any) => (
    <View {...headerProps}>
      <Text category="h6">SportTracking</Text>
      <Text category="s1">Add new workout</Text>
    </View>
  );

  const Footer = (footerProps: any) => (
    <View {...footerProps} style={[footerProps.style, styles.footerContainer]}>
      <Button
        style={styles.footerControl}
        size="small"
        status="basic"
        onPress={onSubmit}
      >
        Save
      </Button>
    </View>
  );

  const renderWorkoutType = (key: number, workoutTitle: string) => (
    <SelectItem key={key} title={workoutTitle} />
  );

  return (
    <Card
      disabled
      style={styles.card}
      header={Header}
      footer={Footer}
    >
      <Input
        style={styles.field}
        value={title}
        label="Workout title"
        placeholder="The name of your workout"
        caption="You should name your new workout here"
        secureTextEntry={false}
        onChangeText={(nextValue) => setTitle(nextValue)}
      />
      <Input
        style={styles.field}
        value={description}
        label="Workout description"
        placeholder="The description of your workout"
        caption="You should give a short summary of your workout here"
        secureTextEntry={false}
        onChangeText={(nextValue) => setDescription(nextValue)}
      />
      <Select
        label="Workout type"
        placeholder="The type of your workout"
        caption="You should select the type of workout here"
        style={styles.field}
        value={type}
        selectedIndex={selectedIndex}
        // @ts-ignore
        onSelect={(index) => setSelectedIndex(index)}
      >
        {data.map((element, idx) => renderWorkoutType(idx, element))}
      </Select>
      <Input
        disabled={!isFormEditable}
        style={styles.field}
        value={_.toString(duration)}
        label="Workout duration"
        placeholder="The duration of your workout in minutes"
        caption="You should add the length of your workout here in minutes"
        secureTextEntry={false}
        onChangeText={(nextValue) => {
          if (nextValue === '') nextValue = String(0);
          if (!_.isNaN(Number(nextValue))) setDuration(Number.parseInt(nextValue, 10));
        }}
      />
      <Input
        disabled={!isFormEditable}
        style={styles.field}
        value={_.toString(distance)}
        label="Workout distance"
        placeholder="The distance of your workout in kilometres"
        caption="You should add the distance of your workout here"
        secureTextEntry={false}
        onChangeText={(nextValue) => {
          if (nextValue === '') nextValue = String(0);
          if (!_.isNaN(Number(nextValue))) setDistance(Number.parseInt(nextValue, 10));
        }}
      />
    </Card>
  );
};
