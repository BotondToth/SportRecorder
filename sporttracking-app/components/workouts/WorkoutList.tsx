import React, { useEffect, useState } from 'react';
import {
  Text,
  Button,
  List,
  Divider,
  Card,
  ListItem,
  Modal,
  Icon,
  Spinner, IndexPath, SelectItem, Select,
} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { CreateWorkoutForm } from './CreateWorkoutForm';
import { Friend, Workout } from '../../types';
import { Client } from '../../api';

const styles = StyleSheet.create({
  modal: { width: '75%' },
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: { marginHorizontal: 2 },
  lowerLine: { marginBottom: 20 },
  workoutHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  workoutTitle: {
    padding: 15,
    backgroundColor: 'white',
  },
  addWorkoutButton: {
    padding: 10,
    width: 200,
  },
  deleteButton: {
    marginHorizontal: 5,
    backgroundColor: 'red',
    borderColor: 'red',
  },
  workoutDetailHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    // justifyContent: 'flex-end',
  },
  shareButton: {
    marginLeft: 'auto', width: '10%',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const WorkoutList = () => {
  const [workoutInDetail, setWorkoutInDetail] = useState<Workout | undefined>(undefined);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutFormVisible, setWorkoutFormVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shareWorkoutVisible, setShareWorkoutVisible] = useState<boolean>(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const client: Client = Client.getInstance();
  // eslint-disable-next-line max-len
  const [workoutToReopenDetailsModalWith, setWorkoutToReopenDetailsModalWith] = useState<Workout | undefined>(workoutInDetail);
  const [selectedIndex, setSelectedIndex] = useState<IndexPath[]>([]);
  let shareNameHolder = '';
  selectedIndex.forEach((index) => {
    shareNameHolder += `${friends[index.row].friend.fullName}, `;
  });

  const getWorkouts = async () => {
    setIsLoading(true);
    try {
      const response = await client.sendRequest<Workout[]>('workouts');
      setWorkouts(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getFriends = async (workoutId: string) => {
    setIsLoading(true);
    try {
      const response = await client.sendRequest<Friend[]>(`friendsForWorkout?workoutId=${workoutId}`);
      setFriends(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorkout = async (workoutId: string): Promise<any> => {
    try {
      const response = await client.sendRequest(`workout/${workoutId}`, null, true);
      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const renderPersonIcon = (props: any) => (
    <Icon {...props} name="person-done-outline" />
  );

  const renderShareIcon = (props: any) => (
    <Icon {...props} name="share-outline" />
  );

  useEffect(() => {
    getWorkouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onWorkOutPress = (workout: Workout) => {
    setWorkoutInDetail(workout);
    setWorkoutToReopenDetailsModalWith(workout);
  };

  const renderWorkouts = ({ item }: { item: Workout }) => (
    <ListItem
      title={item.title}
      description={item.description}
      accessoryLeft={renderPersonIcon}
      onPress={() => onWorkOutPress(item)}
    />
  );

  const WorkoutDetailHeader = (props: any) => (
    <View {...props} style={[props.style, styles.workoutDetailHeaderContainer]}>
      <Text category="h6">Workout Details</Text>
      <Button
        style={styles.shareButton}
        appearance="ghost"
        size="large"
        accessoryLeft={renderShareIcon}
        onPress={async () => {
          setWorkoutToReopenDetailsModalWith(workoutInDetail);
          setWorkoutInDetail(undefined);
          await getFriends(workoutToReopenDetailsModalWith.id);
          setShareWorkoutVisible(true);
        }}
      />
    </View>
  );

  const ShareWorkoutHeader = (props: any) => (
    <View {...props} style={[props.style, styles.workoutDetailHeaderContainer]}>
      <Text category="h6">Share your workout!</Text>
    </View>
  );

  const ShareWorkoutFooter = (props: any) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      <Button
        style={styles.deleteButton}
        size="small"
        onPress={async () => {
          const selectedFriendIds = [];
          selectedIndex.forEach((index) => {
            selectedFriendIds.push(friends[index.row].friend.id);
          });

          await client.sendRequest('bulkShares', {
            friendIds: selectedFriendIds, workoutId: workoutToReopenDetailsModalWith.id,
          });

          setWorkoutInDetail(workoutToReopenDetailsModalWith);
          setShareWorkoutVisible(false);
        }}
      >
        Share
      </Button>
      <Button
        style={styles.footerControl}
        size="small"
        onPress={() => {
          setWorkoutInDetail(workoutToReopenDetailsModalWith);
          setShareWorkoutVisible(false);
        }}
      >
        Close
      </Button>
    </View>
  );

  const WorkoutDetailFooter = (props: any) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      <Button
        style={styles.deleteButton}
        size="small"
        onPress={async () => {
          await deleteWorkout(workoutInDetail.id);
          setWorkoutInDetail(undefined);
          await getWorkouts();
        }}
      >
        Delete
      </Button>
      <Button
        style={styles.footerControl}
        size="small"
        onPress={() => setWorkoutInDetail(undefined)}
      >
        Close
      </Button>
    </View>
  );

  return (
    <>
      <View style={styles.workoutHeader}>
        {workoutFormVisible && (
        <Modal
          style={styles.modal}
          visible={workoutFormVisible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => {
            setWorkoutFormVisible(false);
          }}
        >
          <CreateWorkoutForm
            onFinish={async () => {
              setWorkoutFormVisible(false);
              await getWorkouts();
            }}
          />
        </Modal>
        )}
        <Text category="h5" style={styles.workoutTitle}>
          Workout history
        </Text>
        <Button
          style={styles.addWorkoutButton}
          size="small"
          onPress={() => setWorkoutFormVisible(true)}
        >
          Add new workout
        </Button>
      </View>
      {workoutInDetail && (
      <Modal
        style={styles.modal}
        visible={!!workoutInDetail}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setWorkoutInDetail(undefined)}
      >
        <Card
          status="primary"
          disabled
          header={WorkoutDetailHeader}
          footer={WorkoutDetailFooter}
        >
          <Text category="s1">Title</Text>
          <Text style={styles.lowerLine}>
            {workoutInDetail.title}
          </Text>

          <Text category="s1">Description</Text>
          <Text style={styles.lowerLine}>
            {workoutInDetail.description}
          </Text>

          <Text category="s1">Type</Text>
          <Text style={styles.lowerLine}>
            {workoutInDetail.type}
          </Text>

          <Text category="s1">Duration</Text>
          <Text style={styles.lowerLine}>
            {workoutInDetail.duration}
          </Text>

          <Text category="s1">Distance</Text>
          <Text style={styles.lowerLine}>
            {workoutInDetail.distance}
            {' '}
            km
          </Text>

          <Text category="s1">Calories</Text>
          <Text style={styles.lowerLine}>
            {workoutInDetail.calories}
            {' '}
            kcal
          </Text>

          {workoutInDetail.type === 'Running' && (
          <>
            <Text category="s1">Beers</Text>
            <Text style={styles.lowerLine}>
              {workoutInDetail.beersPerWorkout}
            </Text>
          </>
          )}
        </Card>
      </Modal>
      )}
      <Modal
        style={styles.modal}
        visible={shareWorkoutVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => {
          setWorkoutInDetail(workoutToReopenDetailsModalWith);
          setShareWorkoutVisible(false);
        }}
      >
        <Card
          status="primary"
          disabled
          header={ShareWorkoutHeader}
          footer={ShareWorkoutFooter}
        >
          <Select
            value={shareNameHolder}
            multiSelect
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}
          >
            {
              friends.map((friend) => (
                <SelectItem key={friend.id} title={friend.friend.fullName} />
              ))
            }
          </Select>
        </Card>
      </Modal>
      {isLoading
        ? (
          <View style={styles.loading}>
            <Spinner size="giant" />
          </View>
        )
        : (
          <List
            data={workouts}
            ItemSeparatorComponent={Divider}
            renderItem={renderWorkouts}
          />
        )}
    </>
  );
};
