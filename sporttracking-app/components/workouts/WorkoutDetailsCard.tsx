import React, { useState } from 'react';
import { Button, Card, Icon, Text } from '@ui-kitten/components';
import { Dimensions, StyleSheet, View } from 'react-native';
import _ from 'lodash';
import { BoundingBox, getBoundingBox } from 'geolocation-utils';
import MapView, { Polyline } from './MapViewWrapper';

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: { marginHorizontal: 5 },
  lowerLine: { marginBottom: 20 },
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
    marginLeft: 'auto', width: '10%',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width / 1.1,
    height: Dimensions.get('window').height / 1.5,
  },
});

export const WorkoutDetailsCard = (props) => {
  const [cardViewMode, setCardViewMode] = useState<'details' | 'map'>('details');

  const {
    workoutInDetail,
    setWorkoutInDetail,
    workoutToReopenDetailsModalWith,
    setWorkoutToReopenDetailsModalWith,
    setShareWorkoutVisible,
    getFriends,
    deleteWorkout,
    setSelectedViewMode,
  } = props;

  const renderShareIcon = (iconProps: any) => (
    <Icon {...iconProps} name="share-outline" />
  );

  const WorkoutDetailHeader = (headerProps: any) => (
    <View {...headerProps} style={[headerProps.style, styles.workoutDetailHeaderContainer]}>
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

  const WorkoutDetailFooter = (footerProps: any) => (
    <View {...footerProps} style={[footerProps.style, styles.footerContainer]}>
      <Button
        style={styles.deleteButton}
        size="small"
        onPress={async () => {
          await deleteWorkout(workoutInDetail.id);
          setWorkoutInDetail(undefined);
          setSelectedViewMode('feed'); // todo
        }}
      >
        Delete
      </Button>
      {
        (workoutInDetail.locationPoints && !_.isEmpty(workoutInDetail)) && (
          <Button
            status="success"
            style={styles.footerControl}
            size="small"
            onPress={() => setCardViewMode('map')}
          >
            View
          </Button>
        )
      }
      <Button
        style={styles.footerControl}
        size="small"
        onPress={() => setWorkoutInDetail(undefined)}
      >
        Close
      </Button>
    </View>
  );

  const cardViewContent = () => (
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
        {' '}
        minutes
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
  );

  const mapViewContent = () => {
    const bbox: BoundingBox = getBoundingBox(workoutInDetail.locationPoints, 0);
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: bbox.topLeft.latitude,
            longitude: bbox.bottomRight.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Polyline strokeWidth={3} strokeColor="red" lineJoin="round" lineCap="round" coordinates={workoutInDetail.locationPoints} />
        </MapView>
        <Button
          style={styles.footerControl}
          size="small"
          onPress={() => setCardViewMode('details')}
        >
          Back
        </Button>
      </View>
    );
  };

  if (cardViewMode === 'details') {
    return cardViewContent();
  }

  return mapViewContent();
};