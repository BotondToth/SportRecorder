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
  IndexPath,
  SelectItem,
  Select,
} from '@ui-kitten/components';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { CreateWorkoutForm } from './forms/CreateWorkoutForm';
import { Friendship, Workout } from '../../types';
import { LoadingSpinner } from '../LoadingSpinner';
import { Client } from '../../api';
import { RecordWorkoutForm } from './forms/RecordWorkoutForm';
import { WorkoutDetailsForm } from './forms/WorkoutDetailsForm';

const styles = StyleSheet.create({
  modal: {
    maxHeight: Dimensions.get('window').height * 0.75,
    width: Dimensions.get('window').width * (Platform.OS === 'web' ? 0.45 : 0.75),
  },
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
  recordWorkoutButton: {
    padding: 10,
    width: 200,
    marginTop: 10,
    marginBottom: 10,
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
  },
  shareButton: {
    marginLeft: 'auto',
    width: '10%',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGroup: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  buttonGroupButton: { width: 200 },
  mainContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutList: {
    width: Dimensions.get('window').width * 0.8,
    backgroundColor: 'white',
  },
  workoutContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export const WorkoutList = () => {
  const [workoutInDetail, setWorkoutInDetail] = useState<Workout | undefined>(undefined);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [feedData, setFeedData] = useState<Workout[]>([]);
  const [workoutFormVisible, setWorkoutFormVisible] = useState<boolean>(false);
  const [recordWorkoutFormVisible, setRecordWorkoutFormVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shareWorkoutVisible, setShareWorkoutVisible] = useState<boolean>(false);
  const [friends, setFriends] = useState<Friendship[]>([]);
  // eslint-disable-next-line max-len
  const [workoutToReopenDetailsModalWith, setWorkoutToReopenDetailsModalWith] = useState<Workout | undefined>(workoutInDetail);
  const [selectedIndex, setSelectedIndex] = useState<IndexPath[]>([]);
  const [selectedViewMode, setSelectedViewMode] = useState<string>('feed');
  const client: Client = Client.getInstance();
  let shareNameHolder = '';
  selectedIndex.forEach((index) => {
    shareNameHolder += `${friends[index.row]?.friend.fullName}, `;
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

  const getFeedData = async () => {
    setIsLoading(true);
    try {
      const response = await client.sendRequest<Workout[]>('feed');
      setFeedData(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getFriends = async (workoutId: string) => {
    setIsLoading(true);
    try {
      const response = await client.sendRequest<Friendship[]>(`friendsForWorkout?workoutId=${workoutId}`);
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
      setSelectedViewMode('feed');
      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const renderPersonIcon = (props: any) => (
    <Icon {...props} name="person-done-outline" />
  );

  useEffect(() => {
    if (selectedViewMode === 'workouts') {
      getWorkouts();
    } else {
      getFeedData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedViewMode]);

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

  const renderFeedData = ({ item }: { item: Workout }) => (
    <ListItem
      title={`${item.user.username}: ${item.title}`}
      description={item.description}
      accessoryLeft={renderPersonIcon}
      onPress={() => onWorkOutPress(item)}
    />
  );

  const ShareWorkoutHeader = (props: any) => (
    <View {...props} style={[props.style, styles.workoutDetailHeaderContainer]}>
      <Text category="h6">Share your workout!</Text>
    </View>
  );

  const ShareWorkoutFooter = (props: any) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      <Button
        disabled={shareNameHolder === ''}
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

  return (
    <>
      <View style={styles.workoutHeader}>
        {
          recordWorkoutFormVisible && (
            <Modal
              style={styles.modal}
              visible={recordWorkoutFormVisible}
              backdropStyle={styles.backdrop}
              onBackdropPress={() => {
                setRecordWorkoutFormVisible(false);
              }}
            >
              <RecordWorkoutForm onSave={() => {
                setRecordWorkoutFormVisible(false);
                setSelectedViewMode('workouts');
              }}
              />
            </Modal>
          )
        }
        {
          workoutFormVisible && (
            <Modal
              style={styles.modal}
              visible={workoutFormVisible}
              backdropStyle={styles.backdrop}
              onBackdropPress={() => {
                setWorkoutFormVisible(false);
              }}
            >
              <CreateWorkoutForm
                onFinish={() => {
                  setWorkoutFormVisible(false);
                  setSelectedViewMode('workouts');
                }}
              />
            </Modal>
          )
        }
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
        {
          Platform.OS === 'android' && (
            <Button
              style={styles.recordWorkoutButton}
              size="small"
              onPress={() => setRecordWorkoutFormVisible(true)}
            >
              Record workout
            </Button>
          )
        }
        <View style={styles.buttonGroup}>
          <Button
            disabled={isLoading}
            status={selectedViewMode === 'feed' ? 'basic' : 'primary'}
            style={styles.buttonGroupButton}
            onPress={() => setSelectedViewMode('feed')}
          >
            Feed
          </Button>

          <Button
            disabled={isLoading}
            status={selectedViewMode === 'workouts' ? 'basic' : 'primary'}
            style={styles.buttonGroupButton}
            onPress={() => setSelectedViewMode('workouts')}
          >
            My Workouts
          </Button>
        </View>
      </View>
      {workoutInDetail && (
        <Modal
          style={styles.modal}
          visible={!!workoutInDetail}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setWorkoutInDetail(undefined)}
        >
          <WorkoutDetailsForm
            workoutInDetail={workoutInDetail}
            setWorkoutInDetail={setWorkoutInDetail}
            workoutToReopenDetailsModalWith={workoutToReopenDetailsModalWith}
            setWorkoutToReopenDetailsModalWith={setWorkoutToReopenDetailsModalWith}
            setShareWorkoutVisible={setShareWorkoutVisible}
            getFriends={getFriends}
            deleteWorkout={deleteWorkout}
            setSelectedViewMode={setSelectedViewMode}
          />
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
          {/* eslint-enable */}
        </Card>
      </Modal>
      {/* eslint-disable-next-line no-nested-ternary */}
      {isLoading
        ? (<LoadingSpinner />)
        : selectedViewMode === 'workouts' ? (
          <View style={styles.workoutContainer}>
            <List
              style={styles.workoutList}
              data={workouts}
              ItemSeparatorComponent={Divider}
              renderItem={renderWorkouts}
            />
          </View>

        ) : (
          <View style={styles.workoutContainer}>
            <List
              style={styles.workoutList}
              data={feedData}
              ItemSeparatorComponent={Divider}
              renderItem={renderFeedData}
            />
          </View>

        )}
    </>
  );
};
