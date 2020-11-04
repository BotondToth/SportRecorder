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

const data = ['Running', 'Cycling', 'Walking'];

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

export const CreateWorkoutForm = (props: any) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const type = data[selectedIndex.row];
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const client: Client = Client.getInstance();

  const onSubmit = async () => {
    const workout = {
      title,
      description,
      type,
      duration,
      distance,
      calories,
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
        style={styles.field}
        value={_.toString(duration)}
        label="Workout duration"
        placeholder="The duration of your workout in minutes"
        caption="You should add the length of your workout here"
        secureTextEntry={false}
        onChangeText={(nextValue) => {
          // eslint-disable-next-line no-param-reassign
          if (nextValue === '') nextValue = String(0);
          if (!_.isNaN(Number(nextValue))) setDuration(Number.parseInt(nextValue, 10));
        }}
      />
      <Input
        style={styles.field}
        value={_.toString(distance)}
        label="Workout distance"
        placeholder="The distance of your workout in kilometres"
        caption="You should add the distance of your workout here"
        secureTextEntry={false}
        onChangeText={(nextValue) => {
          // eslint-disable-next-line no-param-reassign
          if (nextValue === '') nextValue = String(0);
          if (!_.isNaN(Number(nextValue))) setDistance(Number.parseInt(nextValue, 10));
        }}
      />
      <Input
        style={styles.field}
        value={_.toString(calories)}
        label="Burnt calories"
        placeholder="The calories you burnt during your workout"
        caption="You should add the calories you burnt here"
        secureTextEntry={false}
        onChangeText={(nextValue) => {
          // eslint-disable-next-line no-param-reassign
          if (nextValue === '') nextValue = String(0);
          if (!_.isNaN(Number(nextValue))) setCalories(Number.parseInt(nextValue, 10));
        }}
      />
    </Card>
  );
};
